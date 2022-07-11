import React, { PropsWithChildren } from "react"
import { WagmiConfig, defaultChains, configureChains, createClient, chain } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { publicProvider } from "wagmi/providers/public"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"

import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { providers } from "ethers"
import config from "../config"

// Working chain ID
// const networkId = config.networkId
// const localNetworkId = config.localNetworkId

// API key for Alchemy project
const alchemyApiUrl = config.alchemyApiUrl
const alchemyApiUrlHttp = alchemyApiUrl.replace("ws", "http")
const alchemyApiKey = alchemyApiUrl?.split("/").slice(-1)[0] as string

// Chains for connectors to support
const chains = defaultChains

// Add local node support if developing
if (process.env.NODE_ENV === "development") {
  chains.push(chain.hardhat)
  chains.push(chain.localhost)
}

const { provider, webSocketProvider } = configureChains(chains, [
  alchemyProvider({ alchemyId: alchemyApiKey }),
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
      qrcode: true,
      rpc: {
        [chain.mainnet.id]: alchemyApiUrlHttp,
        [chain.goerli.id]: alchemyApiUrlHttp,
      },
    },
  }),
]

const client = createClient({ provider, webSocketProvider, connectors, autoConnect: true })

// Set up connectors
// const connectors = ({ chainId }: { chainId?: number | undefined }) => {
//   return [
//     new InjectedConnector({ chains }),
//     new WalletConnectConnector({
//       chains,
//       options: {
//         qrcode: true,
//         chainId: networkId,
//         rpc: {
//           [networkId]: alchemyApiUrlHttp,
//         },
//       },
//     }),
//   ]
// }

// const provider = ({ chainId }: { chainId?: number | undefined }) => {
//   // Use local node if working on a development chain
//   if (process.env.NODE_ENV === "development" && chainId && chainId === localNetworkId) {
//     return new providers.JsonRpcProvider("http://127.0.0.1:8545")
//   }

//   return new providers.AlchemyProvider(networkId, alchemyApiKey)
// }

export const WagmiProvider: React.FC<PropsWithChildren<unknown>> = ({ children }) => (
  <WagmiConfig client={client}>{children}</WagmiConfig>
)
