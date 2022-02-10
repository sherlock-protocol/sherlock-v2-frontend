import React from "react"
import { useAccount, useConnect, useNetwork } from "wagmi"
import { shortenAddress } from "../../utils/format"
import { Button } from "../Button/Button"
import WalletProviderModal from "../WalletProviderModal/WalletProviderModal"

/**
 * Wallet connection component.
 *
 * It allows changing to the correct network and connecting
 * a wallet via WalletConnect or MetaMask.
 */
const ConnectButton: React.FC = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false)

  const [{ data: connectionData }] = useConnect()
  const [{ data: networkData }, switchNetwork] = useNetwork()
  const [{ data: accountData }] = useAccount()

  /**
   * Triggers a network switch to the correct network
   */
  const handleSwitchToCorrectNetwork = React.useCallback(() => {
    switchNetwork?.(parseInt(`${process.env.REACT_APP_NETWORK_ID}`))
  }, [switchNetwork])

  /**
   * Toggles the connection modal visibility
   */
  const handleToggleConnectionModal = React.useCallback(() => {
    setIsModalVisible(!isModalVisible)
  }, [isModalVisible])

  // Check if any wallet is connected
  if (!connectionData.connected) {
    return (
      <>
        <Button onClick={handleToggleConnectionModal} variant="cta">
          Connect
        </Button>
        {isModalVisible && <WalletProviderModal onClose={handleToggleConnectionModal} />}
      </>
    )
  }

  // Check if correct network is selected
  const isCorrectNetwork = networkData.chain?.id?.toString() === process.env.REACT_APP_NETWORK_ID
  if (!isCorrectNetwork) {
    return (
      <Button variant="cta" onClick={handleSwitchToCorrectNetwork}>
        Switch network
      </Button>
    )
  }
  return <Button variant="cta">{shortenAddress(accountData?.address)}</Button>
}

export default ConnectButton
