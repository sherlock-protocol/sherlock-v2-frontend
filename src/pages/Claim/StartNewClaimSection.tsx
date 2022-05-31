import React, { useCallback, useState } from "react"
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
import { useEffect } from "react"

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

  const { waitForTx } = useWaitTx()
  const [{ data: currentBlockNumber }] = useBlockNumber()
  const { startClaim } = useClaimManager()

  /**
   * Handler for start claim click
   */
  const toggleIsCreating = useCallback(async () => {
    setIsCreating((v) => !v)

    // await waitForTx(
    //   async () =>
    //     await startClaim(
    //       protocol.bytesIdentifier,
    //       ethers.utils.parseEther("1000000"),
    //       connectedAccount.address,
    //       DateTime.now().minus({ days: 10 }).toJSDate(),
    //       "0xffffff"
    //     )
    // )
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
   * Only protocol's agent is allowed to start a new claim
   */
  const canStartNewClaim = connectedAccount?.address === protocol.agent

  /**
   * Validate claim amount
   */
  const claimAmountIsValid = !debouncedAmountBN || debouncedAmountBN?.lte(protocol.coverages[0].coverageAmount)
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
    debouncedAmountBN &&
    claimAmountIsValid

  console.log(protocol)

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
            <Field label="CLAIM AMOUNT">
              <TokenInput
                value={debouncedAmountBN}
                onChange={setClaimAmount}
                token="USDC"
                placeholder="Claim amount"
                isPlaceholderVisible={true}
              />
            </Field>
          </Row>
          <Row>
            <Field
              label="EPLOIT START BLOCK"
              error={!exploitBlockNumberValidInput}
              errorMessage="This is not a valid block number."
            >
              <Input type="number" value={exploitBlockNumber} onChange={setExploitBlockNumber} />
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
            <Button fullWidth disabled={!claimIsValid}>
              Start Claim
            </Button>
          </Row>
        </Column>
      )}
    </Box>
  )
}
