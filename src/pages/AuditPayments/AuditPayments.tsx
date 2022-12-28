import { useCallback, useMemo, useState } from "react"
import cx from "classnames"
import { Title } from "../../components/Title"
import styles from "./AuditPayments.module.scss"
import { Column, Row } from "../../components/Layout"
import { useParams } from "react-router-dom"
import { Box } from "../../components/Box"
import { Table, TBody, Td, Tr } from "../../components/Table/Table"
import { Text } from "../../components/Text"
import { Payment, useProtocolDashboard } from "../../hooks/api/contests/useProtocolDashboard"
import { commify } from "../../utils/units"
import { Input } from "../../components/Input"
import { Button } from "../../components/Button"
import { FaCheckCircle, FaCopy } from "react-icons/fa"
import { useSubmitPayment } from "../../hooks/api/contests/useSubmitPayment"
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer"
import { DateTime } from "luxon"
import { useDebounce } from "use-debounce"
import { useValidateTransaction } from "../../hooks/useValidateTransaction"
import { getTxUrl } from "../../utils/explorer"
import { ErrorModal } from "../ContestDetails/ErrorModal"

export const AuditPayments = () => {
  const { dashboardID } = useParams()
  const { data: protocolDashboard } = useProtocolDashboard(dashboardID ?? "")
  const { submitPayment, isLoading, error: submitPaymentError, reset: resetSubmitPayment } = useSubmitPayment()

  const [initialPaymentTx, setInitialPaymentTx] = useState("")
  const [finalPaymentTx, setFinalPaymentTx] = useState("")
  const [debouncedInitialTx] = useDebounce(initialPaymentTx, 300)
  const [debouncedFinalTx] = useDebounce(finalPaymentTx, 300)
  const { isValid: initialTxValid, isError: initialTxError } = useValidateTransaction(debouncedInitialTx)
  const { isValid: finalTxValid, isError: finalTxError } = useValidateTransaction(debouncedFinalTx)
  const [displayCopiedMessage, setDisplayCopiedMessage] = useState(false)

  const contest = protocolDashboard?.contest
  const paymentsInfo = protocolDashboard?.payments

  const initialPaymentDone = useMemo(
    () => paymentsInfo && contest && paymentsInfo.totalPaid >= paymentsInfo.totalAmount * 0.25,
    [paymentsInfo, contest]
  )
  const fullPaymentDone = useMemo(
    () => paymentsInfo && contest && paymentsInfo.totalPaid >= paymentsInfo.totalAmount,
    [paymentsInfo, contest]
  )

  const [initialPayments, finalPayments] = useMemo(() => {
    if (!paymentsInfo?.payments) return []
    const initialPayments: Payment[] = []
    const finalPayments: Payment[] = []
    let totalPaid = 0
    paymentsInfo.payments.forEach((p) => {
      if (totalPaid < paymentsInfo.totalAmount * 0.25) {
        initialPayments.push(p)
      } else {
        finalPayments.push(p)
      }
      totalPaid += p.amount
    })

    return [initialPayments, finalPayments]
  }, [paymentsInfo])

  const handleSubmitPayment = useCallback(
    (txHash: string) => {
      submitPayment({ protocolDashboardID: dashboardID ?? "", txHash })
      setInitialPaymentTx("")
      setFinalPaymentTx("")
    },
    [submitPayment, dashboardID]
  )

  const handleRecipientAddressCopy = useCallback(async () => {
    protocolDashboard?.paymentsRecipient && (await navigator.clipboard.writeText(protocolDashboard.paymentsRecipient))
    setDisplayCopiedMessage(true)

    const timer = setTimeout(() => {
      setDisplayCopiedMessage(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [protocolDashboard?.paymentsRecipient])

  const handleErrorModalClose = useCallback(() => {
    resetSubmitPayment()
  }, [resetSubmitPayment])

  if (!contest) return null
  if (!paymentsInfo) return null

  const startDate = DateTime.fromSeconds(contest.startDate)
  const endDate = DateTime.fromSeconds(contest.endDate)
  const length = endDate.diff(startDate, "days").days

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
                  <Column spacing="xl" grow={1}>
                    <Box shadow={false}>
                      <Column spacing="m">
                        <Title variant="h2">PAYMENTS</Title>
                        <Text>Send USDC to the address below and paste the transaction hash</Text>
                        <Row
                          spacing="m"
                          className={cx({
                            [styles.mainAddress]: true,
                            [styles.copied]: displayCopiedMessage,
                          })}
                          alignment={[displayCopiedMessage ? "center" : "space-between", "center"]}
                          onClick={handleRecipientAddressCopy}
                        >
                          <Text size="large">
                            {displayCopiedMessage ? "Copied!" : protocolDashboard.paymentsRecipient}
                          </Text>
                          {!displayCopiedMessage && (
                            <Button variant="secondary" size="small" onClick={handleRecipientAddressCopy}>
                              <FaCopy />
                            </Button>
                          )}
                        </Row>
                      </Column>
                    </Box>
                    <Box shadow={false} disabled={initialPaymentDone}>
                      <Column spacing="m">
                        <Row alignment={["start", "center"]} spacing="m">
                          <Title variant="h2">Step 1: Initial Payment</Title>
                          {initialPaymentDone && <FaCheckCircle className={styles.check} />}
                        </Row>

                        <Text>Amount: {commify(paymentsInfo.totalAmount * 0.25)} USDC</Text>
                        <Column spacing="xs">
                          {!initialPaymentDone && (
                            <Column spacing="xs">
                              <Text size="small">Transaction hash</Text>
                              <Row spacing="m">
                                <Input value={initialPaymentTx} onChange={setInitialPaymentTx} variant="small" />
                                <Button
                                  onClick={() => handleSubmitPayment(initialPaymentTx)}
                                  disabled={!initialTxValid}
                                >
                                  Submit
                                </Button>
                              </Row>
                              {initialTxError && (
                                <Text variant="warning" size="small">
                                  Invalid transaction hash
                                </Text>
                              )}
                            </Column>
                          )}
                          <Column spacing="s">
                            <Column spacing="xs">
                              {initialPayments && initialPayments.length > 0 && (
                                <>
                                  <Title variant="h4">Previous payments</Title>
                                  {initialPayments?.map((p) => (
                                    <Row spacing="m">
                                      <Column>
                                        <a
                                          href={getTxUrl(p.txHash)}
                                          target="_blank"
                                          rel="noreferrer"
                                          className={styles.transactionHash}
                                        >{`${p.txHash.slice(0, 16)}...`}</a>
                                      </Column>
                                      <Column>
                                        <Text size="small" variant="secondary" strong>
                                          {`${commify(p.amount)} USDC`}
                                        </Text>
                                      </Column>
                                    </Row>
                                  ))}
                                </>
                              )}
                            </Column>
                          </Column>
                        </Column>
                      </Column>
                    </Box>
                    <Box shadow={false} disabled={!initialPaymentDone || fullPaymentDone}>
                      <Column spacing="m">
                        <Row alignment={["start", "center"]} spacing="m">
                          <Title variant="h2">Step 2: Full Payment</Title>
                          {fullPaymentDone && <FaCheckCircle className={styles.check} />}
                        </Row>

                        {!fullPaymentDone && (
                          <Column spacing="xs">
                            <Text size="small">Transaction Hash</Text>
                            <Row spacing="m">
                              <Input
                                disabled={!initialPaymentDone}
                                value={finalPaymentTx}
                                onChange={setFinalPaymentTx}
                                variant="small"
                              />
                              <Button onClick={() => handleSubmitPayment(finalPaymentTx)} disabled={!finalTxValid}>
                                Submit
                              </Button>
                            </Row>
                            {finalTxError && (
                              <Text variant="warning" size="small">
                                Invalid transaction hash
                              </Text>
                            )}
                          </Column>
                        )}

                        <Text>Total paid: {commify(paymentsInfo.totalPaid)} USDC</Text>
                        {!fullPaymentDone && (
                          <Text>Amount due: {commify(paymentsInfo.totalAmount - paymentsInfo.totalPaid)} USDC</Text>
                        )}

                        <Column spacing="s">
                          <Column spacing="xs">
                            {finalPayments && finalPayments.length > 0 && (
                              <>
                                <Title variant="h4">Previous payments</Title>
                                {finalPayments?.map((p) => (
                                  <Row spacing="m">
                                    <Column>
                                      <a
                                        href={getTxUrl(p.txHash)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={styles.transactionHash}
                                      >{`${p.txHash.slice(0, 16)}...`}</a>
                                    </Column>
                                    <Column>
                                      <Text size="small" variant="secondary" strong>
                                        {`${commify(p.amount)} USDC`}
                                      </Text>
                                    </Column>
                                  </Row>
                                ))}
                              </>
                            )}
                          </Column>
                        </Column>
                      </Column>
                    </Box>
                    {fullPaymentDone && (
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
                    )}
                  </Column>
                </Row>
              </Column>
            </Row>
            {submitPaymentError && <ErrorModal reason={submitPaymentError.message} onClose={handleErrorModalClose} />}
          </LoadingContainer>
        </div>
      </div>
    </div>
  )
}
