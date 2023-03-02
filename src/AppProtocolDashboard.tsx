import React, { useCallback, useEffect, useState } from "react"
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
import Modal, { Props as ModalProps } from "./components/Modal/Modal"
import LoadingContainer from "./components/LoadingContainer/LoadingContainer"
import { ErrorModal } from "./pages/ContestDetails/ErrorModal"
import { useFinalizeSubmission } from "./hooks/api/contests/useFinalizeSubmission"
import { ProtocolDashboardSideBar } from "./pages/protocol_dashboard/ProtocolDashboardSideBar/ProtocolDashboardSideBar"
import { getCurrentStep } from "./utils/protocolDashboard"
import { commify } from "ethers/lib/utils.js"
import { FaGithub, FaCheckCircle, FaRegCircle, FaCheck } from "react-icons/fa"
import { Box } from "./components/Box"
import { Table, TBody, Tr, Td } from "./components/Table/Table"

type Props = ModalProps & {
  dashboardID: string
}

const FinalizeSubmissionModal: React.FC<Props> = ({ onClose, dashboardID }) => {
  const { finalizeSubmission, isSuccess, isLoading, error, reset } = useFinalizeSubmission()
  useEffect(() => {
    if (isSuccess) {
      onClose?.()
    }
  }, [isSuccess, onClose])

  const handleCancelClick = useCallback(() => {
    onClose?.()
  }, [onClose])

  const handleConfirmClick = useCallback(() => {
    finalizeSubmission({ dashboardID })
  }, [dashboardID, finalizeSubmission])

  return (
    <Modal closeable onClose={onClose}>
      <LoadingContainer loading={isLoading} label="Loading ...">
        <Column spacing="xl">
          <Title>Finalize submission</Title>
          <Text>Make sure you're done with the repo README</Text>
          <Text>Once you confirm this action, the audit repo will become read-only</Text>
          <Text variant="secondary">This action cannot be undone.</Text>
          <Row spacing="l" alignment={["center"]}>
            <Button variant="secondary" onClick={handleCancelClick}>
              Cancel
            </Button>
            <Button onClick={handleConfirmClick}>Confirm</Button>
          </Row>
        </Column>
      </LoadingContainer>
      {error && <ErrorModal reason={error?.message} onClose={() => reset()} />}
    </Modal>
  )
}

const AppProtocolDashboard = () => {
  const { dashboardID } = useParams()
  const childRoute = useOutlet()
  const { data: protocolDashboard } = useProtocolDashboard(dashboardID ?? "")
  const [finalizeSubmissionModalOpen, setFinalizeSubmissionModalOpen] = useState(false)

  const renderChildRoute = useCallback(() => {
    if (childRoute) return <Outlet />

    if (!protocolDashboard?.contest) return null

    const currentStep = getCurrentStep(protocolDashboard?.contest)

    if (currentStep === "INITIAL_PAYMENT") return <Navigate replace to={protocolDashboardRoutes.InitialPayment} />
    if (currentStep === "SCOPE") return <Navigate replace to={protocolDashboardRoutes.Scope} />
    if (currentStep === "TEAM") return <Navigate replace to={protocolDashboardRoutes.Team} />
    if (currentStep === "FINAL_PAYMENT") return <Navigate replace to={protocolDashboardRoutes.Payments} />
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

  const fullyPaid = contest.fullPaymentComplete
  const canFinalizeSubmission = fullyPaid && protocolDashboard.scopeHasContracts

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
              <ProtocolDashboardSideBar dashboardID={dashboardID} />
              <Box shadow={false} className={styles.sticky}>
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
                        <Text alignment="right">{contest.leadSeniorAuditorHandle}</Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text strong>Audit Contest Pot</Text>
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
                    {contest.judgingPrizePool > 0 && (
                      <Tr>
                        <Td>
                          <Text strong>Judging Contest Pot</Text>
                        </Td>
                        <Td>
                          <Text alignment="right">{`${commify(contest.judgingPrizePool)} USDC`}</Text>
                        </Td>
                      </Tr>
                    )}
                    {contest.sherlockFee > 0 && (
                      <Tr>
                        <Td>
                          <Text strong>Sherlock Admin</Text>
                        </Td>
                        <Td>
                          <Text alignment="right">{`${commify(contest.sherlockFee)} USDC`}</Text>
                        </Td>
                      </Tr>
                    )}
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
            <Column grow={1} className={styles.scrollable}>
              {renderChildRoute()}
            </Column>
          </Row>
        </div>
      </div>
      <Footer />
      {finalizeSubmissionModalOpen && (
        <FinalizeSubmissionModal
          dashboardID={dashboardID ?? ""}
          onClose={() => setFinalizeSubmissionModalOpen(false)}
        />
      )}
    </div>
  )
}

export default AppProtocolDashboard
