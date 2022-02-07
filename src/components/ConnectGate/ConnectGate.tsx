import React from "react"
import { useConnect } from "wagmi"
import ConnectButton from "../ConnectButton/ConnectButton"

/**
 * HOC for requesting the connection of a wallet
 * before another action
 */
const ConnectGate: React.FC = ({ children }) => {
  const [{ data }] = useConnect()

  if (data?.connected) {
    return <>{children}</>
  }

  return <ConnectButton />
}

export default ConnectGate
