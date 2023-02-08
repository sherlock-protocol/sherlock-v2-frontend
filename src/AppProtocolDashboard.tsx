import React, { useCallback, useEffect, useState } from "react"
import { Outlet, useParams } from "react-router-dom"
import { FaCheck, FaGithub } from "react-icons/fa"
import { commify } from "ethers/lib/utils.js"
import { DateTime, Interval } from "luxon"

import { Footer } from "./components/Footer"
import { Header, NavigationLink } from "./components/Header"
import styles from "./App.module.scss"
import { protocolDashboardRoutes, routes } from "./utils/routes"
import { useProtocolDashboard } from "./hooks/api/contests/useProtocolDashboard"
import { Column, Row } from "./components/Layout"
import { Box } from "./components/Box"
import { Title } from "./components/Title"
import { Table, TBody, Td, Tr } from "./components/Table/Table"
import { Text } from "./components/Text"
import { Button } from "./components/Button"
import Modal, { Props as ModalProps } from "./components/Modal/Modal"
import { useFinalizeSubmission } from "./hooks/api/contests/useFinalizeSubmission"
import LoadingContainer from "./components/LoadingContainer/LoadingContainer"

type Props = ModalProps & {
  dashboardID: string
}

const FinalizeSubmissionModal: React.FC<Props> = ({ onClose, dashboardID }) => {
  const { finalizeSubmission, isLoading, isSuccess } = useFinalizeSubmission()

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
  }, [finalizeSubmission, dashboardID])

  return (
    <Modal closeable onClose={onClose}>
      <LoadingContainer loading={isLoading}>
        <Column spacing="xl">
          <Title>Finalize submission</Title>
          <Text>By confirming this action, the repo will become read-only.</Text>
          <Text>Sherlock will review the details and confirm the start date soon.</Text>
          <Text variant="secondary">This action cannot be undone.</Text>
          <Row spacing="l" alignment={["center"]}>
            <Button variant="secondary" onClick={handleCancelClick}>
              Cancel
            </Button>
            <Button onClick={handleConfirmClick}>Confirm</Button>
          </Row>
        </Column>
      </LoadingContainer>
    </Modal>
  )
}

const AppProtocolDashboard = () => {
  const { dashboardID } = useParams()
  const { data: protocolDashboard } = useProtocolDashboard(dashboardID ?? "")
  const [finalizeSubmissionModalOpen, setFinalizeSubmissionModalOpen] = useState(false)

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
  ]

  const { contest, payments } = protocolDashboard
  const startDate = DateTime.fromSeconds(contest.startDate, { zone: "utc" })
  const endDate = DateTime.fromSeconds(contest.endDate, { zone: "utc" })
  const length = Interval.fromDateTimes(startDate, endDate).length("days")
  const fullyPaid = payments.totalPaid >= payments.totalAmount

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
                <Column spacing="s" alignment={["center"]}>
                  <Button variant="secondary" onClick={() => window.open(contest.repo, "blank")} fullWidth>
                    <FaGithub />
                    &nbsp;&nbsp;Audit repository
                  </Button>
                  {!contest.submissionReady && (
                    <Button
                      disabled={!fullyPaid || contest.submissionReady}
                      fullWidth
                      onClick={() => setFinalizeSubmissionModalOpen(true)}
                    >
                      Finalize submission
                    </Button>
                  )}
                  {!fullyPaid && (
                    <Text variant="secondary" size="small">
                      You need to submit the full payment
                    </Text>
                  )}
                  {contest.submissionReady && (
                    <Column spacing="s" alignment={["center"]}>
                      <Text variant="secondary">
                        <FaCheck /> Submission ready
                      </Text>
                      {contest.startApproved ? (
                        <Text variant="secondary" strong>
                          Contest start date approved
                        </Text>
                      ) : (
                        <Text variant="secondary">Sherlock team will review it and confirm the start date</Text>
                      )}
                    </Column>
                  )}
                </Column>
              </Box>
            </Column>
            <Column grow={1}>
              <Outlet />
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
