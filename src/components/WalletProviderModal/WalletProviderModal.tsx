import React from "react"
import { useConnect } from "wagmi"
import { Button } from "../Button/Button"
import styles from "./WalletProviderModal.module.scss"

interface Props {
  onClose: () => void
}

/**
 * Modal that allows selecting one of the supported
 * wallet providers, in order to connect to the web application.
 */
const WalletProviderModal: React.FC<Props> = ({ onClose }) => {
  const [{ data, loading, error }, connect] = useConnect()

  /**
   * Connects via given connector
   */
  const handleConnectWithConnector = React.useCallback(
    (e: React.SyntheticEvent, connectorId: string) => {
      e.stopPropagation()

      const connector = data?.connectors?.find((item) => item.id === connectorId)

      if (!connector) {
        return
      }

      connect(connector)
    },
    [data, connect]
  )

  React.useEffect(() => {
    if (data.connected) {
      onClose()
    }
  }, [data, onClose])

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.container}>
        {loading && <h1>Connecting...</h1>}
        {error && <pre>{error?.message}</pre>}
        <div>
          <Button onClick={(e) => handleConnectWithConnector(e, "injected")}>MetaMask</Button>
        </div>
      </div>
    </div>
  )
}

export default WalletProviderModal
