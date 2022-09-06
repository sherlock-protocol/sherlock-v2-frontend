import React, { PropsWithChildren, useCallback, useEffect, useState } from "react"
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi"
import config from "../../config"
import { shortenAddress } from "../../utils/format"
import { setUser } from "../../utils/sentry"
import { Button } from "../Button"
import { AccountModal } from "../../components/AccountModal"
import WalletProviderModal from "../WalletProviderModal/WalletProviderModal"

/**
 * Wallet connection component.
 *
 * It allows changing to the correct network and connecting
 * a wallet via WalletConnect or MetaMask.
 */
const ConnectButton: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [isConnectModalVisible, setIsConnectModalVisible] = useState(false)
  const [isAccountModalVisible, setIsAccountModalVisible] = useState(false)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)

  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const { address: connectedAddress, isConnected } = useAccount()

  /**
   * Set Sentry User
   */
  useEffect(() => {
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
  const handleSwitchToCorrectNetwork = useCallback(() => {
    switchNetwork?.(config.networkId)
  }, [switchNetwork])

  /**
   * Toggles the connection modal visibility
   */
  const handleToggleConnectionModal = useCallback(() => {
    setIsConnectModalVisible((v) => !v)
  }, [])

  /**
   * Toggles the account modal visibility
   */
  const handleToggleAccountModal = useCallback(() => {
    setIsAccountModalVisible((v) => !v)
  }, [])

  // Check if any wallet is connected
  if (!isConnected) {
    return (
      <>
        <Button onClick={handleToggleConnectionModal} variant="cta">
          Connect
        </Button>
        {isConnectModalVisible && <WalletProviderModal onClose={handleToggleConnectionModal} />}
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
  return (
    <>
      {isAccountModalVisible && <AccountModal closeable onClose={handleToggleAccountModal} />}
      <Button variant="cta" onClick={handleToggleAccountModal}>
        {shortenAddress(connectedAddress)}
      </Button>
    </>
  )
}

export default ConnectButton
