import { ethers } from "ethers"
import React, { PropsWithChildren, useCallback, useEffect, useState } from "react"
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
  const [txState, setTxState] = useState(TxState.NONE)
  const [txHash, setTxHash] = useState<string | undefined>()
  const [txType, setTxType] = useState<TxType>(TxType.GENERIC)
  const [modalIsOpen, setModalIsOpen] = useState(false)

  useEffect(() => {
    setModalIsOpen(true)
  }, [txType, setModalIsOpen])

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

  const handleModalClose = useCallback(() => {
    setModalIsOpen((v) => !v)
  }, [setModalIsOpen])

  const renderTxModal = useCallback(() => {
    if (!modalIsOpen) return null

    switch (txState) {
      case TxState.REQUESTED:
        return <RequestedTx onClose={handleModalClose} />
      case TxState.PENDING:
        return <PendingTx type={txType} hash={txHash} onClose={handleModalClose} />
      case TxState.SUCCESS:
        return <SuccessTx type={txType} hash={txHash} onClose={handleModalClose} />
      case TxState.REVERTED:
        return <RevertedTx hash={txHash} onClose={handleModalClose} />
      case TxState.USER_DENIED:
        return <UserDeniedTx onClose={handleModalClose} />
    }
  }, [txState, modalIsOpen])

  const ctx = React.useMemo(() => ({ waitForTx }), [waitForTx])

  return (
    <TxWaitContext.Provider value={ctx}>
      {children}
      {renderTxModal()}
    </TxWaitContext.Provider>
  )
}

const useWaitTx = () => {
  return React.useContext(TxWaitContext)
}

export default useWaitTx
