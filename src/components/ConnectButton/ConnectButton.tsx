import React, { PropsWithChildren } from "react"
import { useAccount, useConnect, useNetwork } from "wagmi"
import config from "../../config"
import { shortenAddress } from "../../utils/format"
import { setUser } from "../../utils/sentry"
import { Button } from "../Button/Button"
import WalletProviderModal from "../WalletProviderModal/WalletProviderModal"

/**
 * Wallet connection component.
 *
 * It allows changing to the correct network and connecting
 * a wallet via WalletConnect or MetaMask.
 */
const ConnectButton: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false)

  const [{ data: connectionData }] = useConnect()
  const [{ data: networkData }, switchNetwork] = useNetwork()
  const [{ data: accountData }] = useAccount()

  /**
   * Set Sentry User
   */
  React.useEffect(() => {
    setUser(accountData?.address ? { username: accountData?.address } : null)
  }, [accountData?.address])

  /**
   * Triggers a network switch to the correct network
   */
  const handleSwitchToCorrectNetwork = React.useCallback(() => {
    switchNetwork?.(config.networkId)
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
  const isCorrectNetwork = networkData.chain?.id === config.networkId
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
