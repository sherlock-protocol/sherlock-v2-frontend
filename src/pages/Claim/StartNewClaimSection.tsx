import React, { useCallback, useState } from "react"
import { BigNumber, ethers } from "ethers"
import { useAccount, useBlockNumber } from "wagmi"
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
import { uploadFile } from "./uploadFile"

type Props = {
  protocol: Protocol
}

export const StartNewClaimSection: React.FC<Props> = ({ protocol }) => {
  const [{ data: connectedAccount }] = useAccount()
  const [isCreating, setIsCreating] = useState(false)
  const [claimAmount, setClaimAmount] = useState<BigNumber>()
  const [additionalInformationFile, setAdditionalInformationFile] = useState<File>()
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
    async (file: File, hash: string) => {
      setAdditionalInformationFile(file)
      setAdditionalInformationHash(hash)
    },
    [setAdditionalInformationFile, setAdditionalInformationHash]
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

    let additionalInformationFileURL: string | null = null

    if (additionalInformationFile) {
      const path = `claims/${protocol.name}_${protocol.bytesIdentifier}_${exploitBlockNumber}.pdf`
      additionalInformationFileURL = await uploadFile(additionalInformationFile, path)
    }

    try {
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
            additionalInformationFileURL && additionalInformationHash
              ? {
                  link: additionalInformationFileURL,
                  hash: additionalInformationHash,
                }
              : undefined
          )
      )
    } catch (e) {
    } finally {
      setSubmittingClaim(false)
    }
  }, [
    canStartNewClaim,
    claimIsValid,
    protocol.agreement,
    protocol.agreement_hash,
    protocol.name,
    protocol.bytesIdentifier,
    additionalInformationFile,
    waitForTx,
    exploitBlockNumber,
    startClaim,
    claimAmount,
    receiverAddress,
    additionalInformationHash,
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
