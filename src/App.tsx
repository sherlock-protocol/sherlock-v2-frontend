import React from "react"
import { Route, Routes, Navigate } from "react-router-dom"

import { FundraisingClaimPage } from "./pages/FundraisingClaim"
import { StakingPage } from "./pages/Staking"
import { StakingPositionsPage } from "./pages/StakingPositions"
import { USForbiddenPage } from "./pages/USForbidden"
import { OverviewPage } from "./pages/Overview"
import { ProtocolPage } from "./pages/Protocol"
import AppStakers from "./AppStakers"
import AppProtocols from "./AppProtocols"
import AppInternal from "./AppInternal"

import { routes, protocolsRoutes, internalRoutes } from "./utils/routes"
import MobileBlock from "./components/MobileBlock/MobileBlock"
import { InternalOverviewPage } from "./pages/InternalOverview/InternalOverview"

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

          <Route path="*" element={<Navigate replace to={protocolsRoutes.Balance} />} />
        </Route>

        {/** Internal section routes */}
        <Route path={`${routes.Internal}/*`} element={<AppInternal />}>
          <Route path={internalRoutes.InternalOverview} element={<InternalOverviewPage />} />

          <Route path="*" element={<Navigate replace to={internalRoutes.InternalOverview} />} />
        </Route>

        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>

      <MobileBlock />
    </>
  )
}

export default App
