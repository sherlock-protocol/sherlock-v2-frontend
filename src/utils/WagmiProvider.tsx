import React from "react"
import { Provider, defaultChains, developmentChains } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { providers } from "ethers"
import config from "../config"

// Working chain ID
const networkId = config.networkId
const localNetworkId = config.localNetworkId

// API key for Alchemy project
const alchemyApiUrl = config.alchemyApiUrl
const alchemyApiUrlHttp = alchemyApiUrl.replace("ws", "http")
const alchemyApiKey = alchemyApiUrl?.split("/").slice(-1)[0] as string

// Chains for connectors to support
const chains = defaultChains

// Add local node support if developing
if (__DEV__) {
  chains.push(...developmentChains)
}

// Set up connectors
const connectors = ({ chainId }: { chainId?: number | undefined }) => {
  return [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
        chainId: networkId,
        rpc: {
          [networkId]: alchemyApiUrlHttp,
        },
      },
    }),
  ]
}

const provider = ({ chainId }: { chainId?: number | undefined }) => {
  console.log("Fetching provider for chain", chainId)

  // Use local node if working on a development chain
  if (__DEV__ && chainId && chainId === localNetworkId) {
    return new providers.JsonRpcProvider("http://127.0.0.1:8545")
  }

  return new providers.AlchemyProvider(networkId, alchemyApiKey)
}

export const WagmiProvider: React.FC = ({ children }) => (
  <Provider autoConnect provider={provider} connectors={connectors}>
    {children}
  </Provider>
)
