import React, { useCallback, useEffect, useState } from "react"
import { BigNumber, ethers } from "ethers"
import { useQueryClient } from "react-query"
import { useAccount, useProvider } from "wagmi"
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
import { useDebounce } from "use-debounce"
import { useWaitForBlock } from "../../hooks/api/useWaitForBlock"
import { activeClaimQueryKey } from "../../hooks/api/claims"

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
  const [exploitBlockNumber, setExploitBlockNumber] = useState<number>()
  const [exploitStartInput, setExploitStartInput] = useState<string>("")
  const [debouncedExploitStartInput] = useDebounce(exploitStartInput, 300)
  const [isResolvingBlock, setIsResolvingBlock] = useState(false)
  const [blockResolveError, setBlockResolveError] = useState(false)
  const [submittingClaim, setSubmittingClaim] = useState(false)
  const { waitForBlock } = useWaitForBlock()
  const queryClient = useQueryClient()

  const { waitForTx } = useWaitTx()
  const provider = useProvider()
  const { startClaim } = useClaimManager()

  /**
   * Tries to get a block number from user's exploit start input,
   * wich could be a: block number, a block hash, or a tx hash.
   */
  useEffect(() => {
    if (!debouncedExploitStartInput) {
      setExploitBlockNumber(undefined)
      return
    }

    const resolveBlockNumber = async () => {
      let blockNumber: number | undefined

      const inputAsBlockNumber = parseInt(debouncedExploitStartInput)
      if (!isNaN(inputAsBlockNumber)) {
        try {
          const block = await provider.getBlock(inputAsBlockNumber)
          blockNumber = block.number
        } catch (e) {
          // provider.getBlock throws if it couldn't find a block
        }
      }

      // Checks if blockNumber hasn't resolved and input is a block hash
      if (!blockNumber) {
        try {
          const block = await provider.getBlock(debouncedExploitStartInput)
          if (block) {
            blockNumber = block.number
          }
        } catch (e) {
          // provider.getBlock throws if it couldn't find a block
        }
      }

      // Checks if blockNumber hasn't resolved and input is a tx hash
      if (!blockNumber) {
        try {
          const tx = await provider.getTransaction(debouncedExploitStartInput)
          if (tx && tx.blockNumber) {
            blockNumber = tx.blockNumber
          }
        } catch (e) {
          // provider.getTransaction throws if it couldn't find a tx
        }
      }

      setIsResolvingBlock(false)
      setExploitBlockNumber(blockNumber)
      setBlockResolveError(!!!blockNumber)
    }

    setIsResolvingBlock(true)
    resolveBlockNumber()
  }, [debouncedExploitStartInput, provider])

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
   * Validate whole form for submission
   */
  const claimIsValid =
    receiverAddress && receiverAddressValidInput && exploitBlockNumber && claimAmount && claimAmountIsValid

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
      const txReceipt = await waitForTx(
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

      await waitForBlock(txReceipt.blockNumber)

      await queryClient.invalidateQueries(activeClaimQueryKey(protocol.id))
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
              error={blockResolveError && !isResolvingBlock}
              errorMessage="This is not a valid block number."
              detail={
                isResolvingBlock ? "Validating block ..." : exploitBlockNumber ? `Block: ${exploitBlockNumber}` : ""
              }
            >
              <Input value={exploitStartInput} onChange={setExploitStartInput} />
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
