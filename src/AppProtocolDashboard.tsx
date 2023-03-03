import React, { useCallback } from "react"
import { Navigate, Outlet, useOutlet, useParams } from "react-router-dom"
import { DateTime, Interval } from "luxon"

import { Footer } from "./components/Footer"
import { Header, NavigationLink } from "./components/Header"
import styles from "./App.module.scss"
import { protocolDashboardRoutes, routes } from "./utils/routes"
import { useProtocolDashboard } from "./hooks/api/contests/useProtocolDashboard"
import { Column, Row } from "./components/Layout"
import { Title } from "./components/Title"
import { Text } from "./components/Text"
import { Button } from "./components/Button"
import { ProtocolDashboardSideBar } from "./pages/protocol_dashboard/ProtocolDashboardSideBar/ProtocolDashboardSideBar"
import { getCurrentStep } from "./utils/protocolDashboard"
import { FaGithub } from "react-icons/fa"
import { Box } from "./components/Box"
import { Table, TBody, Tr, Td } from "./components/Table/Table"

const AppProtocolDashboard = () => {
  const { dashboardID } = useParams()
  const childRoute = useOutlet()
  const { data: protocolDashboard } = useProtocolDashboard(dashboardID ?? "")

  const renderChildRoute = useCallback(() => {
    if (childRoute) return <Outlet />

    if (!protocolDashboard?.contest) return null

    const currentStep = getCurrentStep(protocolDashboard?.contest)

    if (currentStep === "INITIAL_PAYMENT") return <Navigate replace to={protocolDashboardRoutes.InitialPayment} />
    if (currentStep === "SCOPE") return <Navigate replace to={protocolDashboardRoutes.Scope} />
    if (currentStep === "TEAM") return <Navigate replace to={protocolDashboardRoutes.Team} />
    if (currentStep === "FINAL_PAYMENT") return <Navigate replace to={protocolDashboardRoutes.FinalPayment} />
  }, [childRoute, protocolDashboard?.contest])

  if (!protocolDashboard) return null

  const navigationLinks: NavigationLink[] = [
    {
      title: "TEAM",
      route: protocolDashboardRoutes.Team,
    },
    {
      title: "PAYMENTS",
      route: protocolDashboardRoutes.Payments,
    },
    {
      title: "SCOPE",
      route: protocolDashboardRoutes.Scope,
    },
  ]

  const { contest } = protocolDashboard
  const startDate = DateTime.fromSeconds(contest.startDate, { zone: "utc" })
  const endDate = DateTime.fromSeconds(contest.endDate, { zone: "utc" })
  const length = Interval.fromDateTimes(startDate, endDate).length("days")

  if (!dashboardID) return null

  return (
    <div className={styles.app}>
      <div className={styles.noise} />
      <Header
        navigationLinks={navigationLinks}
        homeRoute={routes.ProtocolDashboard}
        connectButton={false}
        title={protocolDashboard.contest.title}
        logoURL={protocolDashboard.contest.logoURL}
      />
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          <Row spacing="xl" grow={1} className={styles.fullWidth}>
            <Column>
              <Column className={styles.sticky} spacing="xl">
                <ProtocolDashboardSideBar dashboardID={dashboardID} />
                <Box shadow={false}>
                  <Title variant="h2">AUDIT DETAILS</Title>
                  <Table selectable={false}>
                    <TBody>
                      <Tr>
                        <Td>
                          <Text strong>{contest.startApproved ? "Start Date" : "Estimated Start Date"}</Text>
                        </Td>
                        <Td>
                          <Text alignment="right">
                            {startDate.year === 2030 ? "TBD" : startDate.toLocaleString(DateTime.DATE_MED)}
                          </Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <Text strong>Audit Length</Text>
                        </Td>
                        <Td>
                          <Text alignment="right">{`${+length.toFixed(2)} days`}</Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <Text strong>Lead Senior Watson</Text>
                        </Td>
                        <Td>
                          <Text alignment="right">{contest.leadSeniorAuditorHandle ?? "TBD"}</Text>
                        </Td>
                      </Tr>
                    </TBody>
                  </Table>
                  <Column spacing="s">
                    <Button variant="secondary" onClick={() => window.open(contest.repo, "blank")} fullWidth>
                      <FaGithub />
                      &nbsp;&nbsp;Audit repository
                    </Button>
                  </Column>
                </Box>
              </Column>
            </Column>
            <Column grow={1} className={styles.scrollable}>
              {renderChildRoute()}
            </Column>
          </Row>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AppProtocolDashboard
