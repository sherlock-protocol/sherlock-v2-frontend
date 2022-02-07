import React from "react"
import PendingTx from "../components/TxModal/PendingTx"

interface TxWaitContextType {
  waitForTx: (tx: any) => void
}

const TxWaitContext = React.createContext<TxWaitContextType>({} as TxWaitContextType)

enum TxState {
  NONE = 1,
  REQUESTED = 2,
  PENDING = 3,
}

/**
 * Provider for waiting for a pending transaction and show
 * state change alerts
 */
export const TxWaitProvider: React.FC = ({ children }) => {
  const [txState, setTxState] = React.useState(TxState.NONE)

  const waitForTx = React.useCallback(async (tx) => {
    setTxState(TxState.REQUESTED)
    setTxState(TxState.NONE)
  }, [])

  const ctx = React.useMemo(() => ({ waitForTx }), [waitForTx])

  return (
    <TxWaitContext.Provider value={ctx}>
      {children}
      {txState === TxState.PENDING && <PendingTx />}
    </TxWaitContext.Provider>
  )
}

const useWaitTx = () => {
  return React.useContext(TxWaitContext)
}

export default useWaitTx
