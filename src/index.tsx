import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import "./index.module.scss"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import "./polyfills"

import { ApolloProvider } from "./utils/apollo/ApolloProvider"
import { WagmiProvider } from "./utils/WagmiProvider"
import { TxWaitProvider } from "./hooks/useWaitTx"
import { FundraisePositionProvider } from "./hooks/api/useFundraisePosition"
import { StakingPositionsProvider } from "./hooks/api/useStakingPositions"
import { SentryErrorBoundary } from "./utils/sentry"

global.Buffer = global.Buffer || require("buffer").Buffer

ReactDOM.render(
  <React.StrictMode>
    <SentryErrorBoundary>
      <BrowserRouter>
        <WagmiProvider>
          <ApolloProvider>
            <TxWaitProvider>
              <FundraisePositionProvider>
                <StakingPositionsProvider>
                  <App />
                </StakingPositionsProvider>
              </FundraisePositionProvider>
            </TxWaitProvider>
          </ApolloProvider>
        </WagmiProvider>
      </BrowserRouter>
    </SentryErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
