import React from "react"
import { chain, useAccount, useConnect, useNetwork } from "wagmi"
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
    switchNetwork?.(chain.mainnet.id)
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
      <div>
        <Button onClick={handleToggleConnectionModal}>Connect</Button>
        {isModalVisible && <WalletProviderModal onClose={handleToggleConnectionModal} />}
      </div>
    )
  }

  // Check if correct network is selected
  const isCorrectNetwork = networkData.chain?.id?.toString() === process.env.REACT_APP_NETWORK_ID
  if (!isCorrectNetwork) {
    return <Button onClick={handleSwitchToCorrectNetwork}>Switch network</Button>
  }

  return (
    <div>
      <pre>Connected {accountData?.address}</pre>
    </div>
  )
}

export default ConnectButton
