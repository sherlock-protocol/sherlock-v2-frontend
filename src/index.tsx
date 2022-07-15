import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query"
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
import { CoveredProtocolsProvider } from "./hooks/api/useCoveredProtocols"
import { StrategiesProvider } from "./hooks/api/useStrategies"

global.Buffer = global.Buffer || require("buffer").Buffer

const queryClient = new QueryClient()
const container = document.getElementById("root")
const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <SentryErrorBoundary>
      <BrowserRouter>
        <WagmiProvider>
          <QueryClientProvider client={queryClient}>
            <ApolloProvider>
              <TxWaitProvider>
                <FundraisePositionProvider>
                  <StakingPositionsProvider>
                    <CoveredProtocolsProvider>
                      <StrategiesProvider>
                        <App />
                      </StrategiesProvider>
                    </CoveredProtocolsProvider>
                  </StakingPositionsProvider>
                </FundraisePositionProvider>
              </TxWaitProvider>
            </ApolloProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </BrowserRouter>
    </SentryErrorBoundary>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
