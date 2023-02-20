import { useCallback, useMemo, useState } from "react"
import cx from "classnames"
import { Title } from "../../components/Title"
import styles from "./AuditPayments.module.scss"
import { Column, Row } from "../../components/Layout"
import { useParams } from "react-router-dom"
import { Box } from "../../components/Box"
import { Text } from "../../components/Text"
import { Payment, useProtocolDashboard } from "../../hooks/api/contests/useProtocolDashboard"
import { commify } from "../../utils/units"
import { Input } from "../../components/Input"
import { Button } from "../../components/Button"
import { FaCheckCircle, FaCircle, FaCircleNotch, FaCopy, FaRegCircle } from "react-icons/fa"
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
  const {
    isValid: initialTxValid,
    isError: initialTxError,
    isLoading: initialTxLoading,
  } = useValidateTransaction(debouncedInitialTx)
  const {
    isValid: finalTxValid,
    isError: finalTxError,
    isLoading: finalTxLoading,
  } = useValidateTransaction(debouncedFinalTx)
  const [displayCopiedMessage, setDisplayCopiedMessage] = useState(false)

  const contest = protocolDashboard?.contest
  const paymentsInfo = protocolDashboard?.payments

  const initialPaymentDone = contest?.initialPaymentComplete || contest?.fullPaymentComplete
  const fullPaymentDone = contest?.fullPaymentComplete

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

  return (
    <LoadingContainer loading={isLoading}>
      <Row grow={1}>
        <Column grow={1} spacing="xl">
          <Row spacing="xl">
            <Column spacing="xl" grow={1}>
              {fullPaymentDone && (
                <Box shadow={false}>
                  <Column spacing="m">
                    <Row spacing="m">
                      <Text variant="alternate" size="extra-large" strong>
                        PAYMENT COMPLETED
                      </Text>
                      <FaCheckCircle className={styles.check} />
                    </Row>
                    <Row spacing="s">
                      <Text>Contest starts:</Text>
                      {startDate.year === 2030 ? (
                        <Text strong>TBD</Text>
                      ) : (
                        <Text strong>
                          {startDate.toLocaleString(DateTime.DATE_MED)}{" "}
                          {`${startDate.toLocaleString(DateTime.TIME_24_SIMPLE)} ${startDate.offsetNameShort}`}
                        </Text>
                      )}
                    </Row>
                  </Column>
                </Box>
              )}
              {!fullPaymentDone && (
                <Box shadow={false}>
                  <Column spacing="m">
                    <Title variant="h2">PAYMENTS</Title>
                    <Text>Send USDC to the address below and submit the transaction hash.</Text>
                    <Row
                      spacing="m"
                      className={cx({
                        [styles.mainAddress]: true,
                        [styles.copied]: displayCopiedMessage,
                      })}
                      alignment={[displayCopiedMessage ? "center" : "space-between", "center"]}
                      onClick={handleRecipientAddressCopy}
                    >
                      <Text size="large">{displayCopiedMessage ? "Copied!" : protocolDashboard.paymentsRecipient}</Text>
                      {!displayCopiedMessage && (
                        <Button variant="secondary" size="small" onClick={handleRecipientAddressCopy}>
                          <FaCopy />
                        </Button>
                      )}
                    </Row>
                    <Column spacing="xs">
                      <Row spacing="s">
                        <Title variant="h3">Transaction hash</Title>
                        {initialTxLoading ? "Validating ..." : ""}
                      </Row>
                      <Row spacing="m">
                        <Input value={initialPaymentTx} onChange={setInitialPaymentTx} variant="small" />
                        <Button onClick={() => handleSubmitPayment(initialPaymentTx)} disabled={!initialTxValid}>
                          Submit
                        </Button>
                      </Row>
                      {initialTxError && (
                        <Text variant="warning" size="small">
                          Invalid transaction hash
                        </Text>
                      )}
                    </Column>
                  </Column>
                </Box>
              )}

              {paymentsInfo.payments.length > 0 && (
                <Box shadow={false}>
                  <Column spacing="l">
                    <Title variant="h3">PREVIOUS PAYMENTS</Title>
                    <Column spacing="s">
                      {paymentsInfo.payments.map((p) => (
                        <Row spacing="s">
                          <Text variant="secondary" size="small">
                            {`${commify(p.amount)} USDC`}
                          </Text>
                          <a
                            href={getTxUrl(p.txHash)}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.transactionHash}
                          >
                            {p.txHash}
                          </a>
                        </Row>
                      ))}
                    </Column>
                  </Column>
                </Box>
              )}

              {!fullPaymentDone && (
                <>
                  <Box shadow={false} disabled={initialPaymentDone}>
                    <Row
                      spacing="m"
                      alignment={["start", "center"]}
                      className={cx({ [styles.completed]: initialPaymentDone })}
                    >
                      <Text size="extra-large">{initialPaymentDone ? <FaCheckCircle /> : <FaRegCircle />}</Text>
                      <Column spacing="xs">
                        <Text variant={initialPaymentDone ? "alternate" : "normal"} size="small" strong>
                          INITIAL PAYMENT
                        </Text>
                        <Row spacing="s" alignment={["start", "baseline"]}>
                          <Text size="extra-large" strong>
                            {`${commify(paymentsInfo.totalAmount * 0.25)} USDC`}
                          </Text>
                          <Text>{`Due ${startDate.minus({ hours: 3 * 24 }).toLocaleString(DateTime.DATE_MED)}`}</Text>
                        </Row>
                        <ul>
                          <li>
                            <Text variant="secondary" size="small">
                              Publish contest
                            </Text>
                            <Text variant="secondary" size="small">
                              Start Lead Senior Watson selection process
                            </Text>
                          </li>
                        </ul>
                      </Column>
                    </Row>
                  </Box>

                  <Box shadow={false} disabled={!initialPaymentDone || fullPaymentDone}>
                    <Row
                      spacing="m"
                      alignment={["start", "center"]}
                      className={cx({ [styles.completed]: fullPaymentDone })}
                    >
                      <Text size="extra-large">{fullPaymentDone ? <FaCheckCircle /> : <FaRegCircle />}</Text>
                      <Column spacing="xs">
                        <Text variant={fullPaymentDone ? "alternate" : "normal"} size="small" strong>
                          FULL PAYMENT
                        </Text>
                        <Row spacing="s" alignment={["start", "baseline"]}>
                          <Text size="extra-large" strong>
                            {`${commify(paymentsInfo.totalAmount * 0.75)} USDC`}
                          </Text>
                          <Text>{`Due ${startDate.minus({ hours: 1 * 24 }).toLocaleString(DateTime.DATE_MED)}`}</Text>
                        </Row>
                        <ul>
                          <li>
                            <Text variant="secondary" size="small">
                              Lock contest start date
                            </Text>
                          </li>
                        </ul>
                      </Column>
                    </Row>
                  </Box>
                </>
              )}
            </Column>
          </Row>
        </Column>
      </Row>
      {submitPaymentError && <ErrorModal reason={submitPaymentError.message} onClose={handleErrorModalClose} />}
    </LoadingContainer>
  )
}
