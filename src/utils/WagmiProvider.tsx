import React, { PropsWithChildren } from "react"
import { WagmiConfig, configureChains, createClient } from "wagmi"
import { mainnet, goerli, hardhat, localhost, Chain } from "wagmi/chains"
import { InjectedConnector } from "wagmi/connectors/injected"
import { publicProvider } from "wagmi/providers/public"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
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

const { provider, webSocketProvider } = configureChains(chains, [
  alchemyProvider({ apiKey: alchemyApiKey }),
  publicProvider(),
  jsonRpcProvider({
    rpc: () => ({
      http: "http://127.0.0.1:8545",
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
      projectId: "67c86b4ce6dac476f6f20f41c4ef0364",
      metadata: {
        name: "Sherlock Audits",
        description: "",
        url: "sherlock.xyz",
        icons: [],
      },
      showQrModal: true,
      qrModalOptions: {
        themeVariables: {
          "--wcm-z-index": "1000",
        },
      },
    },
  }),
]

const client = createClient({ provider, webSocketProvider, connectors, autoConnect: true })

export const WagmiProvider: React.FC<PropsWithChildren<unknown>> = ({ children }) => (
  <WagmiConfig client={client}>{children}</WagmiConfig>
)
