import React from "react"
import { useConnect } from "wagmi"
import Modal from "../Modal/Modal"
import styles from "./WalletProviderModal.module.scss"
import { ReactComponent as Metamask } from "../../assets/icons/metamask.svg"
import { ReactComponent as WalletConnect } from "../../assets/icons/walletconnect.svg"

interface Props {
  onClose: () => void
}

/**
 * Modal that allows selecting one of the supported
 * wallet providers, in order to connect to the web application.
 */
const WalletProviderModal: React.FC<Props> = ({ onClose }) => {
  const [{ data }, connect] = useConnect()

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
    <Modal closeable onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.provider} onClick={(e) => handleConnectWithConnector(e, "injected")}>
          <Metamask height={45} width={45} />
          <h1>MetaMask</h1>
          <p>Connect to your MetaMask wallet</p>
        </div>
        <div className={styles.provider}>
          <WalletConnect height={45} width={45} />
          <h1>WalletConnect</h1>
          <p>Scan with WalletConnect to connect</p>
        </div>
        {/* <Button onClick={(e) => handleConnectWithConnector(e, "injected")}>MetaMask</Button> */}
      </div>
    </Modal>
  )
}

export default WalletProviderModal
