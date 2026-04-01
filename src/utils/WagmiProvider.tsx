import React, { PropsWithChildren } from "react"
import { WagmiProvider as WagmiProviderCore, createConfig, http, injected } from "wagmi"
import { mainnet, goerli, hardhat, localhost, type Chain } from "wagmi/chains"
import config from "../config"

// API key for Alchemy project
const alchemyApiUrl = config.alchemyApiUrl
const alchemyApiKey = alchemyApiUrl?.split("/").slice(-1)[0] as string

// Chains for connectors to support
const chains: Chain[] = [mainnet, goerli]

// Add local node support if developing
if (process.env.NODE_ENV === "development") {
  chains.push(hardhat)
  chains.push(localhost)
}

const transports = Object.fromEntries(
  chains.map((chain) => {
    const isMainnet = chain.id === mainnet.id
    const hasAlchemy = Boolean(alchemyApiKey) && isMainnet
    const url = hasAlchemy ? alchemyApiUrl : chain.rpcUrls.default.http[0]
    return [chain.id, http(url)]
  })
)

const wagmiConfig = createConfig({
  chains,
  connectors: [injected()],
  transports: transports as Record<number, ReturnType<typeof http>>,
  ssr: false,
})

export const WagmiProvider: React.FC<PropsWithChildren<unknown>> = ({ children }) => (
  <WagmiProviderCore config={wagmiConfig}>{children}</WagmiProviderCore>
)
