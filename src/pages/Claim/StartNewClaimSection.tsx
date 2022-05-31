import React, { useCallback, useEffect, useState } from "react"
import { BigNumber, ethers } from "ethers"
import { useAccount, useBlockNumber } from "wagmi"
import { useDebounce } from "use-debounce"

import { Box } from "../../components/Box"
import { Button } from "../../components/Button"
import { Text } from "../../components/Text"
import { Protocol } from "../../hooks/api/protocols"
import { useClaimManager } from "../../hooks/useClaimManager"
import useWaitTx from "../../hooks/useWaitTx"
import { Column, Row } from "../../components/Layout"
import { Title } from "../../components/Title"
import TokenInput from "../../components/TokenInput/TokenInput"
import { Field } from "./Field"
import { Input } from "../../components/Input"
import { FileDrop } from "../../components/FileDrop"
import { formatUSDC } from "../../utils/units"
import { captureException } from "../../utils/sentry"

type Props = {
  protocol: Protocol
}

export const StartNewClaimSection: React.FC<Props> = ({ protocol }) => {
  const [{ data: connectedAccount }] = useAccount()
  const [isCreating, setIsCreating] = useState(false)
  const [claimAmount, setClaimAmount] = useState<BigNumber>()
  const [debouncedAmountBN] = useDebounce(claimAmount, 200)
  const [additionalInformationBase64, setAdditionalInformationBase64] = useState<string>()
  const [additionalInformationHash, setAdditionalInformationHash] = useState<string>()
  const [receiverAddress, setReceiverAddress] = useState<string>("")
  const [exploitBlockNumber, setExploitBlockNumber] = useState<number>(0)
  const [submittingClaim, setSubmittingClaim] = useState(false)

  const { waitForTx } = useWaitTx()
  const [{ data: currentBlockNumber }] = useBlockNumber()
  const { startClaim } = useClaimManager()

  /**
   * Handler for start claim click
   */
  const toggleIsCreating = useCallback(async () => {
    setIsCreating((v) => !v)
  }, [setIsCreating])

  /**
   * Handle additional information file change
   */
  const hadleAdditionalInformationFileChange = useCallback(
    (_, content: string, hash: string) => {
      setAdditionalInformationBase64(content)
      setAdditionalInformationHash(hash)
    },
    [setAdditionalInformationBase64, setAdditionalInformationHash]
  )

  /**
   * Handle block number change
   */
  const handleBlockNumberChange = useCallback((value: string) => {
    setExploitBlockNumber(parseInt(value))
  }, [])

  /**
   * Only protocol's agent is allowed to start a new claim
   */
  const canStartNewClaim = connectedAccount?.address === protocol.agent

  /**
   * Validate claim amount
   */
  const maxClaimableAmount = protocol.coverages[0].coverageAmount
  const claimAmountIsValid = !claimAmount || claimAmount?.lte(maxClaimableAmount)
  /**
   * Validate receiver address
   */
  const receiverAddressValidInput = !receiverAddress || ethers.utils.isAddress(receiverAddress)
  /**
   * Validate exploit block number
   */
  const exploitBlockNumberValidInput =
    !currentBlockNumber || !exploitBlockNumber || exploitBlockNumber < currentBlockNumber
  /**
   * Validate whole form for submission
   */
  const claimIsValid =
    receiverAddress &&
    receiverAddressValidInput &&
    exploitBlockNumber &&
    exploitBlockNumberValidInput &&
    claimAmount &&
    claimAmountIsValid

  /**
   * Handle submit claim click
   */
  const handleSubmitClaim = useCallback(async () => {
    if (!canStartNewClaim || !claimIsValid) return
    if (!protocol.agreement || !protocol.agreement_hash) {
      throw Error("Protocol coverage agreement is missing")
    }

    setSubmittingClaim(true)

    await waitForTx(
      async () =>
        await startClaim(
          protocol.bytesIdentifier,
          claimAmount,
          receiverAddress,
          exploitBlockNumber,
          {
            link: protocol.agreement!,
            hash: protocol.agreement_hash!,
          },
          {
            link: protocol.agreement!,
            hash: protocol.agreement_hash!,
          }
        )
    )
    setSubmittingClaim(false)
  }, [
    startClaim,
    waitForTx,
    setSubmittingClaim,
    canStartNewClaim,
    claimIsValid,
    protocol.bytesIdentifier,
    claimAmount,
    receiverAddress,
    exploitBlockNumber,
    protocol.agreement,
    protocol.agreement_hash,
  ])

  return (
    <Box shadow={false} fixedWidth>
      {!isCreating ? (
        <Column spacing="m">
          <Text size="normal" strong>
            {protocol.name} has no active claim.
          </Text>
          <Button onClick={toggleIsCreating} disabled={!canStartNewClaim}>
            Start new claim
          </Button>

          {!canStartNewClaim && <Text size="small">Only the protocol's agent is allowed to start a new claim.</Text>}
        </Column>
      ) : (
        <Column spacing="xl">
          <Title>Start new claim</Title>
          <Row>
            <Field
              label="CLAIM AMOUNT"
              error={!claimAmountIsValid}
              errorMessage={`Max. claimable amount is ${formatUSDC(maxClaimableAmount)} USDC`}
            >
              <TokenInput onChange={setClaimAmount} token="USDC" />
            </Field>
          </Row>
          <Row>
            <Field
              label="EPLOIT START BLOCK"
              error={!exploitBlockNumberValidInput}
              errorMessage="This is not a valid block number."
            >
              <Input type="number" value={exploitBlockNumber.toString()} onChange={handleBlockNumberChange} />
            </Field>
          </Row>
          <Row>
            <Field
              label="RECEIVER ADDRESS"
              detail="This is the address that's going to receive the payout"
              error={!receiverAddressValidInput}
              errorMessage="This is not a valid address."
            >
              <Input variant="small" value={receiverAddress} onChange={setReceiverAddress} />
            </Field>
          </Row>
          <Row>
            <Field label="UPLOAD ADDITIONAL INFORMATION FILE" detail="Submit additional evidence in a .pdf format">
              <FileDrop onFileChange={hadleAdditionalInformationFileChange} />
            </Field>
          </Row>
          <Row>
            <Field
              label="COVERAGE AGREEMENT HASH"
              detail={
                <span>
                  Hash is based on the{" "}
                  <a target="_blank" href={protocol.agreement} rel="noreferrer">
                    current coverage agreement
                  </a>
                  .
                </span>
              }
            >
              <Input value={protocol.agreement_hash} variant="small" disabled />
            </Field>
          </Row>

          <Row spacing="s">
            <Button onClick={handleSubmitClaim} fullWidth disabled={!claimIsValid || submittingClaim}>
              {submittingClaim ? "Submitting claim ..." : "Submit Claim"}
            </Button>
          </Row>
        </Column>
      )}
    </Box>
  )
}
