import { ethers } from "ethers"
import React, { PropsWithChildren } from "react"
import PendingTx from "../components/TxStateModals/PendingTx"
import RequestedTx from "../components/TxStateModals/RequestedTx"
import RevertedTx from "../components/TxStateModals/RevertedTx"
import SuccessTx from "../components/TxStateModals/SuccessTx"
import UserDeniedTx from "../components/TxStateModals/UserDeniedTx"
import { TxState, TxType } from "../utils/txModalMessages"
import { addTransactionBreadcrumb, captureException } from "../utils/sentry"

interface TxWaitContextType {
  waitForTx: (
    tx: () => Promise<ethers.ContractTransaction>,
    options?: {
      transactionType?: TxType
    }
  ) => Promise<ethers.ContractReceipt>
}

const TxWaitContext = React.createContext<TxWaitContextType>({} as TxWaitContextType)

/**
 * Provider for waiting for a pending transaction and show
 * state change alerts
 */
export const TxWaitProvider: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [txState, setTxState] = React.useState(TxState.NONE)
  const [txHash, setTxHash] = React.useState<string | undefined>()
  const [txType, setTxType] = React.useState<TxType>(TxType.GENERIC)

  /**
   * Wrap a contract transaction and follow transaction state changes
   * with visual updates.
   */
  const waitForTx = React.useCallback(
    async (
      tx: () => Promise<ethers.ContractTransaction>,
      options?: {
        transactionType?: TxType
      }
    ): Promise<ethers.ContractReceipt> => {
      setTxHash(undefined)
      setTxState(TxState.REQUESTED)
      setTxType(options?.transactionType ?? TxType.GENERIC)

      try {
        const transaction = await tx()

        addTransactionBreadcrumb(transaction)

        setTxState(TxState.PENDING)
        setTxHash(transaction.hash)

        const receipt = await transaction.wait()

        // Skip success state if it's an approval transaction
        if (options?.transactionType === TxType.APPROVE) {
          setTxState(TxState.NONE)
        } else {
          setTxState(TxState.SUCCESS)
        }

        return receipt
      } catch (error: any) {
        // User denied transaction (EIP-1193)
        if (error?.code === 4001 || error === "User rejected the transaction") {
          setTxState(TxState.USER_DENIED)
        } else {
          captureException(new Error(error?.message), {
            extra: error,
            tags: {
              section: "transactions",
            },
          })
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
      {txState === TxState.PENDING && <PendingTx type={txType} hash={txHash} />}
      {txState === TxState.SUCCESS && <SuccessTx type={txType} hash={txHash} />}
      {txState === TxState.REVERTED && <RevertedTx hash={txHash} />}
      {txState === TxState.USER_DENIED && <UserDeniedTx />}
    </TxWaitContext.Provider>
  )
}

const useWaitTx = () => {
  return React.useContext(TxWaitContext)
}

export default useWaitTx
