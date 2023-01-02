import React from "react"
import { Outlet, useParams } from "react-router-dom"
import { Footer } from "./components/Footer"
import { Header, NavigationLink } from "./components/Header"

import styles from "./App.module.scss"
import { protocolDashboardRoutes, routes } from "./utils/routes"
import { useProtocolDashboard } from "./hooks/api/contests/useProtocolDashboard"
import { Column, Row } from "./components/Layout"
import { Box } from "./components/Box"
import { Title } from "./components/Title"
import { Table, TBody, Td, Tr } from "./components/Table/Table"
import { commify } from "ethers/lib/utils.js"
import { DateTime } from "luxon"
import { Text } from "./components/Text"

const AppProtocolDashboard = () => {
  const { dashboardID } = useParams()
  const { data: protocolDashboard } = useProtocolDashboard(dashboardID ?? "")

  if (!protocolDashboard) return null

  const navigationLinks: NavigationLink[] = [
    {
      title: "PAYMENTS",
      route: protocolDashboardRoutes.Payments,
    },
  ]

  const contest = protocolDashboard.contest
  const startDate = DateTime.fromSeconds(contest.startDate)
  const endDate = DateTime.fromSeconds(contest.endDate)
  const length = endDate.diff(startDate, "days").days

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
              <Box shadow={false}>
                <Title variant="h2">AUDIT DETAILS</Title>
                <Table selectable={false}>
                  <TBody>
                    <Tr>
                      <Td>
                        <Text strong>Estimated Start Date</Text>
                      </Td>
                      <Td>
                        <Text alignment="right">{startDate.toLocaleString(DateTime.DATE_MED)}</Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text strong>Audit Length</Text>
                      </Td>
                      <Td>
                        <Text alignment="right">{`${length} days`}</Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text strong>Lead Senior Watson</Text>
                      </Td>
                      <Td>
                        <Text alignment="right">{contest.leadSeniorAuditorHandle}</Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text strong>Contest Pot</Text>
                      </Td>
                      <Td>
                        <Text alignment="right">{`${commify(contest.prizePool)} USDC`}</Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text strong>Lead Senior Watson Fixed Pay</Text>
                      </Td>
                      <Td>
                        <Text alignment="right">{`${commify(contest.leadSeniorAuditorFixedPay)} USDC`}</Text>
                      </Td>
                    </Tr>
                    {contest.sherlockFee > 0 && (
                      <Tr>
                        <Td>
                          <Text strong>Sherlock Judging</Text>
                        </Td>
                        <Td>
                          <Text alignment="right">{`${commify(contest.sherlockFee)} USDC`}</Text>
                        </Td>
                      </Tr>
                    )}
                  </TBody>
                </Table>
              </Box>
            </Column>
            <Column grow={1}>
              <Outlet />
            </Column>
          </Row>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AppProtocolDashboard
