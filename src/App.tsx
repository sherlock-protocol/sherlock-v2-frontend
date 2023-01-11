import React, { useCallback, useEffect } from "react"
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
import AppAdmin from "./AppAdmin"
import { AppContests } from "./AppContests"
import AppProtocolDashboard from "./AppProtocolDashboard"

import { routes, protocolsRoutes, contestsRoutes, protocolDashboardRoutes, adminRoutes } from "./utils/routes"
import MobileBlock from "./components/MobileBlock/MobileBlock"
import { InternalOverviewPage } from "./pages/InternalOverview/InternalOverview"
import { ContestsPage } from "./pages/Contests"
import { ContestDetails } from "./pages/ContestDetails"
import { Scoreboard } from "./pages/Scoreboard"
import { AuditorProfile } from "./pages/AuditorProfile"
import { AuthenticationGate } from "./components/AuthenticationGate"
import { useAccount } from "wagmi"
import { useAuthentication } from "./hooks/api/useAuthentication"
import { AuditPayments } from "./pages/AuditPayments/AuditPayments"
import { ProtocolTeam } from "./pages/ProtocolTeam/ProtocolTeam"
import { AdminContestsList } from "./pages/admin/AdminContestsList/AdminContestsList"

function App() {
  const { address: connectedAddress } = useAccount()
  const { signOut, profile } = useAuthentication()

  const addressIsAllowed = useCallback(
    (address: string) => profile?.addresses.some((a) => a.address === address),
    [profile]
  )

  useEffect(() => {
    if (!connectedAddress || (profile && !addressIsAllowed(connectedAddress))) {
      signOut()
    }
  }, [connectedAddress, addressIsAllowed, signOut, profile])

  return (
    <>
      <Routes>
        {/** Stakers section routes */}
        <Route path="/*" element={<AppStakers />}>
          <Route path={routes.Stake} element={<StakingPage />} />
          <Route path={routes.Overview} element={<OverviewPage />} />
          <Route path={routes.Positions} element={<StakingPositionsPage />} />
          <Route path={routes.Claim} element={<FundraisingClaimPage />} />
          <Route path={routes.USForbidden} element={<USForbiddenPage />} />

          <Route path="*" element={<Navigate replace to={`/${routes.Overview}`} />} />
        </Route>

        {/** Protocols section routes */}
        <Route path={`${routes.Protocols}/*`} element={<AppProtocols />}>
          <Route path={protocolsRoutes.Balance} element={<ProtocolPage />} />
          <Route path={protocolsRoutes.Claims} element={<ClaimsPage />} />

          <Route path="*" element={<Navigate replace to={protocolsRoutes.Balance} />} />
        </Route>

        {/** Protocol Dashboard section routes */}
        <Route path={`${routes.ProtocolDashboard}/*`} element={<AppProtocolDashboard />}>
          <Route path={protocolDashboardRoutes.Team} element={<ProtocolTeam />} />
          <Route path={protocolDashboardRoutes.Payments} element={<AuditPayments />} />

          <Route path="*" element={<Navigate replace to={protocolDashboardRoutes.Payments} />} />
        </Route>

        {/** Audit Contests section routes */}
        <Route path={`${routes.AuditContests}/*`} element={<AppContests />}>
          <Route path={contestsRoutes.Contests} element={<ContestsPage />} />
          <Route path={contestsRoutes.ContestDetails} element={<ContestDetails />} />
          <Route path={contestsRoutes.Leaderboard} element={<Scoreboard />} />

          <Route
            path="scoreboard"
            element={<Navigate to={`/${routes.AuditContests}/${contestsRoutes.Leaderboard}`} />}
          />

          <Route
            path={contestsRoutes.Profile}
            element={
              <AuthenticationGate redirectRoute={routes.AuditContests}>
                <AuditorProfile />
              </AuthenticationGate>
            }
          />

          <Route path="*" element={<Navigate replace to={contestsRoutes.Contests} />} />
        </Route>

        {/** Internal section routes */}
        <Route path={`${routes.Admin}/*`} element={<AppAdmin />}>
          <Route path={adminRoutes.InternalOverview} element={<InternalOverviewPage />} />
          <Route path={adminRoutes.Contests} element={<AdminContestsList />} />

          <Route path="*" element={<Navigate replace to={adminRoutes.InternalOverview} />} />
        </Route>

        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>

      <MobileBlock />
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </>
  )
}

export default App
