import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import "./index.module.scss"
import App from "./App"
import reportWebVitals from "./reportWebVitals"

import { ApolloProvider } from "./utils/apollo/ApolloProvider"
import { WagmiProvider } from "./utils/WagmiProvider"
import { TxWaitProvider } from "./hooks/useWaitTx"

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <WagmiProvider>
        <ApolloProvider>
          <TxWaitProvider>
            <App />
          </TxWaitProvider>
        </ApolloProvider>
      </WagmiProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
