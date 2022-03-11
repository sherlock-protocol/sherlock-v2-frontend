import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import "./index.module.scss"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import "./polyfills"
import * as Sentry from "@sentry/react"
import { BrowserTracing } from "@sentry/tracing"

import { ApolloProvider } from "./utils/apollo/ApolloProvider"
import { WagmiProvider } from "./utils/WagmiProvider"
import { TxWaitProvider } from "./hooks/useWaitTx"
import { FundraisePositionProvider } from "./hooks/api/useFundraisePosition"
import { StakingPositionsProvider } from "./hooks/api/useStakingPositions"
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary"
import { FallbackRender } from "@sentry/react/dist/errorboundary"
import packageInfo from "../package.json"

const ErrorBoundaryComponent: FallbackRender = (props) => <ErrorBoundary {...props} />

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.REACT_APP_SENTRY_ENVIRONMENT,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  release: packageInfo.version,
})

global.Buffer = global.Buffer || require("buffer").Buffer

ReactDOM.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={ErrorBoundaryComponent}>
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
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
