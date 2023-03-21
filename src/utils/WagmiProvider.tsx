import React, { PropsWithChildren } from "react"
import { WagmiConfig, configureChains, createClient } from "wagmi"
import {
  mainnet,
  goerli,
  arbitrum,
  optimism,
  arbitrumGoerli,
  optimismGoerli,
  hardhat,
  localhost,
  Chain,
} from "wagmi/chains"
import { InjectedConnector } from "wagmi/connectors/injected"
import { publicProvider } from "wagmi/providers/public"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import config from "../config"

// API key for Alchemy project
const alchemyApiUrl = config.alchemyApiUrl
const alchemyApiUrlHttp = alchemyApiUrl.replace("ws", "http")
const alchemyApiKey = alchemyApiUrl?.split("/").slice(-1)[0] as string

// Chains for connectors to support
const chains: Chain[] = [mainnet, goerli, arbitrum, optimism, arbitrumGoerli, optimismGoerli]

// Add local node support if developing
if (process.env.NODE_ENV === "development") {
  chains.push(hardhat)
  chains.push(localhost)
}

const { provider, webSocketProvider } = configureChains(chains, [
  alchemyProvider({ apiKey: alchemyApiKey }),
  publicProvider(),
  jsonRpcProvider({
    rpc: (chain) => ({
      http:
        chain.id === localhost.id
          ? "http://127.0.0.1:8545"
          : "https://arb-goerli.g.alchemy.com/v2/dHNN7qPjIuJUwo2oq-tGQ1uudUAHw1oL",
    }),
  }),
])

const connectors = [
  new InjectedConnector({
    chains,
  }),
  new WalletConnectConnector({
    chains,
    options: {
      qrcode: true,
      rpc: {
        [mainnet.id]: alchemyApiUrlHttp,
        [goerli.id]: alchemyApiUrlHttp,
      },
    },
  }),
]

const client = createClient({ provider, webSocketProvider, connectors, autoConnect: true })

export const WagmiProvider: React.FC<PropsWithChildren<unknown>> = ({ children }) => (
  <WagmiConfig client={client}>{children}</WagmiConfig>
)
