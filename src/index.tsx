import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { Provider, defaultChains } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { providers } from "ethers"

// API key for Alchemy project
const alchemyApiKey = process.env.REACT_APP_ALCHEMY_API_KEY

// Chains for connectors to support
const chains = defaultChains

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
  return new providers.AlchemyProvider(chainId, alchemyApiKey)
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider autoConnect provider={provider} connectors={connectors}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
