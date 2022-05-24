import React from "react"
import { Route, Routes, Navigate } from "react-router-dom"
import { ReactQueryDevtools } from "react-query/devtools"

import { FundraisingClaimPage } from "./pages/FundraisingClaim"
import { StakingPage } from "./pages/Staking"
import { StakingPositionsPage } from "./pages/StakingPositions"
import { USForbiddenPage } from "./pages/USForbidden"
import { OverviewPage } from "./pages/Overview"
import { ProtocolPage } from "./pages/Protocol"
import { ClaimsPage } from "./pages/Claim"
import AppStakers from "./AppStakers"
import AppProtocols from "./AppProtocols"

import { routes, protocolsRoutes } from "./utils/routes"
import MobileBlock from "./components/MobileBlock/MobileBlock"

function App() {
  return (
    <>
      <Routes>
        {/** Stakers section routes */}
        <Route path="/*" element={<AppStakers />}>
          <Route path={routes.Stake} element={<StakingPage />} />
          <Route path={routes.Overview} element={<OverviewPage />} />
          <Route path={routes.Positions} element={<StakingPositionsPage />} />
          <Route path={routes.FundraiseClaim} element={<FundraisingClaimPage />} />
          <Route path={routes.USForbidden} element={<USForbiddenPage />} />

          <Route path="*" element={<Navigate replace to={`/${routes.Stake}`} />} />
        </Route>

        {/** Protocols section routes */}
        <Route path={`${routes.Protocols}/*`} element={<AppProtocols />}>
          <Route path={protocolsRoutes.Balance} element={<ProtocolPage />} />
          <Route path={protocolsRoutes.Claims} element={<ClaimsPage />} />

          <Route path="*" element={<Navigate replace to={protocolsRoutes.Balance} />} />
        </Route>

        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>

      <MobileBlock />
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </>
  )
}

export default App
