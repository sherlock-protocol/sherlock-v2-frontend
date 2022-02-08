import { ethers } from "ethers"
import React from "react"
import PendingTx from "../components/TxStateModals/PendingTx"
import RequestedTx from "../components/TxStateModals/RequestedTx"
import RevertedTx from "../components/TxStateModals/RevertedTx"
import SuccessTx from "../components/TxStateModals/SuccessTx"
import UserDeniedTx from "../components/TxStateModals/UserDeniedTx"

interface TxWaitContextType {
  waitForTx: (tx: () => Promise<ethers.ContractTransaction>) => Promise<ethers.ContractReceipt>
}

const TxWaitContext = React.createContext<TxWaitContextType>({} as TxWaitContextType)

enum TxState {
  NONE = 1,
  REQUESTED = 2,
  PENDING = 3,
  SUCCESS = 4,
  REVERTED = 5,
  USER_DENIED = 6,
}

/**
 * Provider for waiting for a pending transaction and show
 * state change alerts
 */
export const TxWaitProvider: React.FC = ({ children }) => {
  const [txState, setTxState] = React.useState(TxState.NONE)

  const waitForTx = React.useCallback(
    async (tx: () => Promise<ethers.ContractTransaction>): Promise<ethers.ContractReceipt> => {
      setTxState(TxState.REQUESTED)

      try {
        const transaction = await tx()
        const receipt = await transaction.wait()

        setTxState(TxState.SUCCESS)
        return receipt
      } catch (error: any) {
        // User denied transaction (EIP-1193)
        if (error?.code === 4001) {
          setTxState(TxState.USER_DENIED)
        } else {
          setTxState(TxState.REVERTED)
        }

        // Propagate error
        throw error
      }
    },
    []
  )

  const ctx = React.useMemo(() => ({ waitForTx }), [waitForTx])

  return (
    <TxWaitContext.Provider value={ctx}>
      {children}
      {txState === TxState.REQUESTED && <RequestedTx />}
      {txState === TxState.PENDING && <PendingTx />}
      {txState === TxState.SUCCESS && <SuccessTx />}
      {txState === TxState.REVERTED && <RevertedTx />}
      {txState === TxState.USER_DENIED && <UserDeniedTx />}
    </TxWaitContext.Provider>
  )
}

const useWaitTx = () => {
  return React.useContext(TxWaitContext)
}

export default useWaitTx
