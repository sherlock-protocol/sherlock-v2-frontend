import React, { PropsWithChildren } from "react"
import { useConnect } from "wagmi"
import ConnectButton from "../ConnectButton/ConnectButton"

/**
 * HOC for requesting the connection of a wallet
 * before another action
 */
const ConnectGate: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [{ data }] = useConnect()

  if (data?.connected) {
    return <>{children}</>
  }

  return <ConnectButton />
}

export default ConnectGate
