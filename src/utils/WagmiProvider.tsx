import React from "react"
import { Provider, defaultChains, developmentChains } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { providers } from "ethers"

// Working chain ID
const networkId = parseInt(`${process.env.REACT_APP_NETWORK_ID}`)
const localNetworkId = parseInt(`${process.env.REACT_APP_LOCALHOST_NETWORK_ID}`)

// API key for Alchemy project
const alchemyApiUrl = process.env.REACT_APP_ALCHEMY_API_URL as string
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
          [networkId]: alchemyApiUrl,
        },
      },
    }),
  ]
}

const provider = ({ chainId }: { chainId?: number | undefined }) => {
  console.log("Fetching provider for chain", chainId)

  // Use local node if working on a development chain
  if (__DEV__ && chainId === localNetworkId) {
    return new providers.JsonRpcProvider("http://127.0.0.1:8545")
  }

  return new providers.AlchemyProvider(networkId, alchemyApiKey)
}

export const WagmiProvider: React.FC = ({ children }) => (
  <Provider autoConnect provider={provider} connectors={connectors}>
    {children}
  </Provider>
)
