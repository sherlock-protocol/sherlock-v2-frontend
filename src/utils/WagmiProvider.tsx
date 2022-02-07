import React from "react"
import { Provider, defaultChains, developmentChains } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { providers } from "ethers"

// API key for Alchemy project
const alchemyApiKey = process.env.REACT_APP_ALCHEMY_API_KEY

// Chains for connectors to support
const chains = defaultChains

// Add local node support if developing
if (process.env.NODE_ENV === "development") {
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
        rpc: {
          1: `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`,
        },
      },
    }),
  ]
}

const provider = ({ chainId }: { chainId?: number | undefined }) => {
  // Use local node if working on a development chain
  if (!chainId || chainId?.toString().indexOf("1337") > -1) {
    return new providers.JsonRpcProvider("http://127.0.0.1:8545")
  }

  return new providers.AlchemyProvider(chainId, alchemyApiKey)
}

export const WagmiProvider: React.FC = ({ children }) => (
  <Provider autoConnect provider={provider} connectors={connectors}>
    {children}
  </Provider>
)
