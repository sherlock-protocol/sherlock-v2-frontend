import React, { PropsWithChildren } from "react"
import { useAccount } from "wagmi"
import ConnectButton from "../ConnectButton/ConnectButton"

/**
 * HOC for requesting the connection of a wallet
 * before another action
 */
const ConnectGate: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const { isConnected } = useAccount()

  if (isConnected) {
    return <>{children}</>
  }

  return <ConnectButton />
}

export default ConnectGate
