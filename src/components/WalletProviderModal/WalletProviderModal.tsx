import React from "react"
import { useConnect } from "wagmi"
import Modal from "../Modal/Modal"
import styles from "./WalletProviderModal.module.scss"
import { ReactComponent as Metamask } from "../../assets/icons/metamask.svg"
import { ReactComponent as WalletConnect } from "../../assets/icons/walletconnect.svg"
import { Title } from "../Title"
import { Text } from "../Text"
import { Column, Row } from "../Layout"

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
      <Column>
        <Row>
          <Column
            alignment="center"
            grow={1}
            className={styles.provider}
            onClick={(e) => handleConnectWithConnector(e, "injected")}
          >
            <Metamask height={45} width={45} />
            <Title>MetaMask</Title>
            <Text>Connect to your MetaMask wallet</Text>
          </Column>
        </Row>
        <Row>
          <Column grow={1}>
            <hr className={styles.divider} />
          </Column>
        </Row>
        <Row>
          <Column alignment="center" grow={1} className={styles.provider}>
            <WalletConnect height={45} width={45} />
            <Title>WalletConnect</Title>
            <Text>Scan with WalletConnect to connect</Text>
          </Column>
        </Row>
      </Column>
    </Modal>
  )
}

export default WalletProviderModal
