import { commify } from "ethers/lib/utils.js"
import { useCallback, useState } from "react"
import cx from "classnames"
import { FaCheckCircle } from "react-icons/fa"
import { useParams } from "react-router-dom"
import { useDebounce } from "use-debounce"
import { Box } from "../../../components/Box"
import { Button } from "../../../components/Button"
import { CopyAddress } from "../../../components/CopyAddress/CopyAddress"
import { Input } from "../../../components/Input"
import { Column, Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { useProtocolDashboard } from "../../../hooks/api/contests/useProtocolDashboard"
import { useSubmitPayment } from "../../../hooks/api/contests/useSubmitPayment"
import { getTxUrl } from "../../../utils/explorer"
import { ErrorModal } from "../../ContestDetails/ErrorModal"

import styles from "../InitialPayment/InitialPayment.module.scss"
import { useValidateTransaction } from "../../../hooks/useValidateTransaction"

export const FinalPayment = () => {
  const { dashboardID } = useParams()
  const { data: protocolDashboard } = useProtocolDashboard(dashboardID ?? "")

  const [transactionHash, setTransactionHash] = useState("")
  const [debouncedTransactionHash] = useDebounce(transactionHash, 300)

  const { submitPayment, isLoading, error: submitPaymentError, reset: resetSubmitPayment } = useSubmitPayment()
  const {
    isValid: transactionValid,
    isError: transactionError,
    isLoading: transactionLoading,
  } = useValidateTransaction(debouncedTransactionHash)

  const handleSubmitPayment = useCallback(
    (txHash: string) => {
      submitPayment({ protocolDashboardID: dashboardID ?? "", txHash })
      setTransactionHash("")
    },
    [submitPayment, dashboardID]
  )

  const handleErrorModalClose = useCallback(() => {
    resetSubmitPayment()
  }, [resetSubmitPayment])

  if (!protocolDashboard) return null

  const amountDue = protocolDashboard.payments.totalAmount - protocolDashboard.payments.totalPaid

  return (
    <LoadingContainer loading={isLoading} label="Processing payment ...">
      <Column spacing="m" className={styles.initialPayment}>
        <Box shadow={false}>
          <Column spacing="xl">
            <Row
              className={cx({ [styles.completed]: protocolDashboard.contest.fullPaymentComplete })}
              alignment={["start", "center"]}
              spacing="s"
            >
              <Title variant="h2">FINAL PAYMENT</Title>
              {protocolDashboard.contest.fullPaymentComplete && (
                <Text variant="alternate" size="large">
                  <FaCheckCircle />
                </Text>
              )}
            </Row>
            <Text variant="secondary">
              Submit the final payment to avoid delays and confirm the start date for the contest.
            </Text>
            <Column spacing="xs">
              <Row spacing="xs">
                <Text>Audit total cost:</Text>
                <Text strong>{`${commify(protocolDashboard.payments.totalAmount)} USDC`}</Text>
              </Row>
              <Row spacing="xs">
                <Text>Amount paid:</Text>
                <Text strong>{`${commify(protocolDashboard.payments.totalPaid)} USDC`}</Text>
              </Row>
              <Row spacing="xs">
                <Text variant={protocolDashboard.contest.fullPaymentComplete ? "secondary" : "alternate"}>
                  Amount due:
                </Text>
                <Text
                  strong
                  variant={protocolDashboard.contest.fullPaymentComplete ? "secondary" : "alternate"}
                >{`${commify(amountDue)} USDC`}</Text>
              </Row>
            </Column>
          </Column>
        </Box>
        {protocolDashboard.contest.fullPaymentComplete ? (
          <Box shadow={false}>
            <Column alignment="center">
              <Text variant="alternate" size="extra-large">
                <FaCheckCircle />
              </Text>
              <Text strong variant="alternate" size="large">
                Final Payment sent
              </Text>
            </Column>
          </Box>
        ) : (
          <Box shadow={false}>
            <Column spacing="m">
              <Title variant="h3">SUBMIT INITIAL PAYMENT</Title>
              <Text>
                1. Send <strong>{`${commify(amountDue)} USDC`}</strong> to the address below
              </Text>
              <CopyAddress address={protocolDashboard.paymentsRecipient} />
              <Text>2. Submit the transaction hash</Text>
              <Column spacing="xs">
                <Row spacing="m">
                  <Input value={transactionHash} onChange={setTransactionHash} variant="small" />
                  <Button onClick={() => handleSubmitPayment(transactionHash)} disabled={!transactionValid}>
                    Submit
                  </Button>
                </Row>
                <Text size="small">{`${transactionLoading ? "- Validating..." : ""}`}</Text>
                {transactionError && (
                  <Text variant="warning" size="small">
                    Invalid transaction hash
                  </Text>
                )}
              </Column>
            </Column>
          </Box>
        )}
        <Box shadow={false}>
          <Column spacing="xl">
            <Row alignment="space-between">
              <Title variant="h2">TRANSACTIONS</Title>
              <Text>
                Total amount paid: <strong>{`${commify(protocolDashboard.payments.totalPaid)} USDC`}</strong>
              </Text>
            </Row>
            <Column spacing="xs">
              {protocolDashboard.payments.payments.map((p) => (
                <Row spacing="s">
                  <Text strong>{`${commify(p.amount)} USDC`}</Text>
                  <a
                    href={getTxUrl(p.txHash)}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.transactionHash}
                  >{`${p.txHash.slice(0, 24)}...`}</a>
                </Row>
              ))}
            </Column>
          </Column>
        </Box>
      </Column>
      {submitPaymentError && <ErrorModal reason={submitPaymentError.message} onClose={handleErrorModalClose} />}
    </LoadingContainer>
  )
}
