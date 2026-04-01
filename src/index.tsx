import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query"
import {
  QueryClient as TanstackQueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from "@tanstack/react-query"

import { WagmiProvider } from "./utils/WagmiProvider"
import { TxWaitProvider } from "./hooks/useWaitTx"
import { FundraisePositionProvider } from "./hooks/api/useFundraisePosition"
import { StakingPositionsProvider } from "./hooks/api/useStakingPositions"
import { SentryErrorBoundary } from "./utils/sentry"

import App from "./App"

import "./index.module.scss"
import reportWebVitals from "./reportWebVitals"
import "./polyfills"
import { AuthenticationContextProvider } from "./hooks/api/useAuthentication"

global.Buffer = global.Buffer || require("buffer").Buffer

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 1000,
      retry: false,
    },
  },
})

const wagmiQueryClient = new TanstackQueryClient()
const container = document.getElementById("root")
const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <WagmiProvider>
        <TanstackQueryClientProvider client={wagmiQueryClient}>
          <QueryClientProvider client={queryClient}>
            <SentryErrorBoundary>
              <TxWaitProvider>
                <FundraisePositionProvider>
                  <StakingPositionsProvider>
                    <AuthenticationContextProvider>
                      <App />
                    </AuthenticationContextProvider>
                  </StakingPositionsProvider>
                </FundraisePositionProvider>
              </TxWaitProvider>
            </SentryErrorBoundary>
          </QueryClientProvider>
        </TanstackQueryClientProvider>
      </WagmiProvider>
    </BrowserRouter>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
