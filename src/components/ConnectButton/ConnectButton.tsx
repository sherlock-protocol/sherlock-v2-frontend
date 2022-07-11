import React, { PropsWithChildren, useEffect, useState } from "react"
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi"
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
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)

  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const { address: connectedAddress, isConnected } = useAccount()

  console.log(isConnected)

  /**
   * Set Sentry User
   */
  React.useEffect(() => {
    setUser(connectedAddress ? { username: connectedAddress } : null)
  }, [connectedAddress])

  /**
   * Check if network is the right one
   */
  useEffect(() => {
    setIsCorrectNetwork(chain?.id === config.networkId)
  }, [chain?.id])

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
  if (!isConnected) {
    return (
      <>
        <Button onClick={handleToggleConnectionModal} variant="cta">
          Connect
        </Button>
        {isModalVisible && <WalletProviderModal onClose={handleToggleConnectionModal} />}
      </>
    )
  }

  if (!isCorrectNetwork) {
    return (
      <Button variant="cta" onClick={handleSwitchToCorrectNetwork}>
        Switch network
      </Button>
    )
  }
  return <Button variant="cta">{shortenAddress(connectedAddress)}</Button>
}

export default ConnectButton
