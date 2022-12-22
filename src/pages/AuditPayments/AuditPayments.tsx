import { Title } from "../../components/Title"

import styles from "./AuditPayments.module.scss"
import { Column, Row } from "../../components/Layout"
import { useParams } from "react-router-dom"
import { useContest } from "../../hooks/api/contests"
import { Box } from "../../components/Box"
import { Table, TBody, Td, Tr } from "../../components/Table/Table"
import { Text } from "../../components/Text"
import { usePayments } from "../../hooks/api/contests/usePayments"
import { commify } from "../../utils/units"
import { Input } from "../../components/Input"
import { Button } from "../../components/Button"
import { FaCheckCircle } from "react-icons/fa"
import { useMemo, useState } from "react"
import { useSubmitPayment } from "../../hooks/api/contests/useSubmitPayment"
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer"
import { DateTime } from "luxon"

export const AuditPayments = () => {
  const { contestId } = useParams()
  const { data: contest } = useContest(parseInt(contestId ?? ""))
  const { data: paymentsInfo } = usePayments(parseInt(contestId ?? ""))
  const { submitPayment, isLoading } = useSubmitPayment()

  const [initialPaymentTx, setInitialPaymentTx] = useState("")
  const [finalPaymentTx, setFinalPaymentTx] = useState("")

  const initialPaymentDone = useMemo(
    () => paymentsInfo && contest && paymentsInfo.totalPaid >= contest.fullPayment * 0.25,
    [paymentsInfo, contest]
  )
  const fullPaymentDone = useMemo(
    () => paymentsInfo && contest && paymentsInfo.totalPaid >= contest.fullPayment,
    [paymentsInfo, contest]
  )

  if (!contest) return null
  if (!paymentsInfo) return null

  const initialPayment = paymentsInfo.payments.at(0)
  const finalPayment = paymentsInfo.payments.at(1)

  const startDate = DateTime.fromSeconds(contest.startDate)

  return (
    <div className={styles.app}>
      <div className={styles.noise} />
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          <LoadingContainer loading={isLoading}>
            <Row grow={1}>
              <Column grow={1} spacing="xl">
                <Row spacing="m" alignment={["start", "center"]}>
                  <img src={contest.logoURL} alt={contest.title} className={styles.logo} />
                  <Title>{contest.title}</Title>
                </Row>
                <Row spacing="xl">
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
                              <Text alignment="right">{contest.startDate}</Text>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td>
                              <Text strong>Audit Length</Text>
                            </Td>
                            <Td>
                              <Text alignment="right">{contest.endDate - contest.startDate}</Text>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td>
                              <Text strong>Contest Pot</Text>
                            </Td>
                            <Td>
                              <Text alignment="right">{contest.prizePool}</Text>
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
                        </TBody>
                      </Table>
                    </Box>
                  </Column>
                  <Column spacing="xl" grow={1}>
                    <Box shadow={false} disabled={initialPaymentDone}>
                      <Column spacing="m">
                        <Row alignment={["start", "center"]} spacing="m">
                          <Title variant="h2">Step 1: Initial Payment</Title>
                          {initialPaymentDone && <FaCheckCircle className={styles.check} />}
                        </Row>

                        <Text>Amount: {commify(paymentsInfo.totalAmount * 0.25)} USDC</Text>
                        <Column spacing="xs">
                          <Text size="small">Transaction hash</Text>
                          {initialPaymentDone ? (
                            <Text>{initialPayment?.txHash}</Text>
                          ) : (
                            <Row spacing="m">
                              <Input value={initialPaymentTx} onChange={setInitialPaymentTx} />
                              <Button
                                onClick={() =>
                                  submitPayment({ contestID: parseInt(contestId ?? ""), txHash: initialPaymentTx })
                                }
                              >
                                Submit
                              </Button>
                            </Row>
                          )}
                        </Column>
                      </Column>
                    </Box>
                    <Box shadow={false} disabled={!initialPaymentDone || fullPaymentDone}>
                      <Column spacing="m">
                        <Row alignment={["start", "center"]} spacing="m">
                          <Title variant="h2">Step 2: Full Payment</Title>
                          {fullPaymentDone && <FaCheckCircle className={styles.check} />}
                        </Row>
                        <Text>Amount: {commify(paymentsInfo.totalAmount * 0.75)} USDC</Text>
                        <Column spacing="xs">
                          <Text size="small">Transaction hash</Text>
                          {fullPaymentDone ? (
                            <Text>{finalPayment?.txHash}</Text>
                          ) : (
                            <Row spacing="m">
                              <Input value={finalPaymentTx} onChange={setFinalPaymentTx} />
                              <Button
                                onClick={() =>
                                  submitPayment({ contestID: parseInt(contestId ?? ""), txHash: finalPaymentTx })
                                }
                              >
                                Submit
                              </Button>
                            </Row>
                          )}
                        </Column>
                      </Column>
                    </Box>
                    <Box shadow={false}>
                      <Column spacing="m">
                        <Row spacing="m">
                          <Text variant="alternate" size="extra-large" strong>
                            Payment completed
                          </Text>
                          <FaCheckCircle className={styles.check} />
                        </Row>
                        <Row spacing="s">
                          <Text>Contest starts:</Text>
                          <Text strong>
                            {startDate.toLocaleString(DateTime.DATE_MED)}{" "}
                            {`${startDate.toLocaleString(DateTime.TIME_24_SIMPLE)} ${startDate.offsetNameShort}`}
                          </Text>
                        </Row>
                      </Column>
                    </Box>
                  </Column>
                </Row>
              </Column>
            </Row>
          </LoadingContainer>
        </div>
      </div>
    </div>
  )
}
