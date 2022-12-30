import React, { useState, useCallback, useEffect } from "react"

import { Modal, Props as ModalProps } from "../../components/Modal/Modal"
import { BigNumber, ethers } from "ethers"
import { useQueryClient } from "react-query"
import { Address, useAccount, useProvider } from "wagmi"
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
import { DateTime } from "luxon"

type Props = ModalProps & {
  protocol: Protocol
}

export const NewClaimModal: React.FC<Props> = ({ protocol, onClose, ...props }) => {
  const { address: connectedAddress } = useAccount()
  const [claimAmount, setClaimAmount] = useState<BigNumber>()
  const [additionalInformationFile, setAdditionalInformationFile] = useState<File>()
  const [additionalInformationHash, setAdditionalInformationHash] = useState<string>()
  const [receiverAddress, setReceiverAddress] = useState<string>("")
  const [exploitBlock, setExploitBlock] = useState<ethers.providers.Block>()
  const [exploitStartInput, setExploitStartInput] = useState<string>("")
  const [debouncedExploitStartInput] = useDebounce(exploitStartInput, 300)
  const [isResolvingBlock, setIsResolvingBlock] = useState(false)
  const [blockResolveError, setBlockResolveError] = useState(false)
  const [submittingClaim, setSubmittingClaim] = useState(false)
  const [displayModalCloseConfirm, setDisplayModalFormConfirm] = useState(false)
  const { waitForBlock } = useWaitForBlock()
  const queryClient = useQueryClient()

  const [canStartNewClaim, setCanStartNewClaim] = useState(false)

  const { waitForTx } = useWaitTx()
  const provider = useProvider()
  const { startClaim } = useClaimManager()

  /**
   * Tries to get a block number from user's exploit start input,
   * wich could be a: block number, a block hash, or a tx hash.
   */
  useEffect(() => {
    if (!debouncedExploitStartInput) {
      setExploitBlock(undefined)
      return
    }

    const resolveBlockNumber = async () => {
      let block: ethers.providers.Block | undefined

      const inputAsBlockNumber = parseInt(debouncedExploitStartInput)
      if (!isNaN(inputAsBlockNumber)) {
        try {
          block = await provider.getBlock(inputAsBlockNumber)
        } catch (e) {
          // provider.getBlock throws if it couldn't find a block
        }
      }

      // Checks if blockNumber hasn't resolved and input is a block hash
      if (!block) {
        try {
          block = await provider.getBlock(debouncedExploitStartInput)
        } catch (e) {
          // provider.getBlock throws if it couldn't find a block
        }
      }

      // Checks if blockNumber hasn't resolved and input is a tx hash
      if (!block) {
        try {
          const tx = await provider.getTransaction(debouncedExploitStartInput)
          if (tx && tx.blockNumber) {
            block = await provider.getBlock(tx.blockNumber)
          }
        } catch (e) {
          // provider.getTransaction throws if it couldn't find a tx
        }
      }

      setIsResolvingBlock(false)
      setExploitBlock(block)
      setBlockResolveError(!!!block)
    }

    setIsResolvingBlock(true)
    resolveBlockNumber()
  }, [debouncedExploitStartInput, provider])

  useEffect(() => {
    setCanStartNewClaim(connectedAddress === protocol.agent)
  }, [connectedAddress, protocol.agent])

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
   * Validate claim amount
   */
  const maxClaimableAmount = protocol.coverages[0].coverageAmount
  const claimAmountIsValid = !claimAmount || claimAmount?.lte(maxClaimableAmount)
  /**
   * Validate receiver address
   */
  const receiverAddressValidInput =
    !receiverAddress || (ethers.utils.isAddress(receiverAddress) && receiverAddress !== ethers.constants.AddressZero)
  /**
   * Validate whole form for submission
   */
  const claimIsValid = receiverAddress && receiverAddressValidInput && exploitBlock && claimAmount && claimAmountIsValid

  /**
   * Form is dirty if the user already filled some fields
   */
  const formIsDirty: boolean = !!receiverAddress || !!claimAmount || !!exploitBlock || !!additionalInformationFile

  /**
   * Handle submit claim click
   */
  const handleSubmitClaim = useCallback(async () => {
    if (!canStartNewClaim || !claimIsValid) return

    setSubmittingClaim(true)

    let additionalInformationFileURL: string | null = null

    if (additionalInformationFile) {
      const path = `claims/${protocol.name}_${protocol.bytesIdentifier}_${exploitBlock.number}.pdf`
      additionalInformationFileURL = await uploadFile(additionalInformationFile, path)
    }

    try {
      const txReceipt = await waitForTx(
        async () =>
          await startClaim(
            protocol.bytesIdentifier,
            claimAmount,
            receiverAddress as Address,
            exploitBlock.number,
            {
              link: protocol.agreement,
              hash: protocol.agreementHash,
            },
            additionalInformationFileURL && additionalInformationHash
              ? {
                  link: additionalInformationFileURL,
                  hash: additionalInformationHash,
                }
              : undefined
          )
      )

      if (txReceipt) {
        await waitForBlock(txReceipt.blockNumber)

        await queryClient.invalidateQueries(activeClaimQueryKey(protocol.id))
      }
    } catch (e) {
    } finally {
      setSubmittingClaim(false)
    }
  }, [
    canStartNewClaim,
    claimIsValid,
    protocol.id,
    protocol.agreement,
    protocol.agreementHash,
    protocol.name,
    protocol.bytesIdentifier,
    queryClient,
    additionalInformationFile,
    waitForTx,
    waitForBlock,
    exploitBlock,
    startClaim,
    claimAmount,
    receiverAddress,
    additionalInformationHash,
  ])

  const handleModalClose = useCallback(() => {
    if (formIsDirty) {
      setDisplayModalFormConfirm(true)
    } else {
      onClose && onClose()
    }
  }, [setDisplayModalFormConfirm, onClose, formIsDirty])

  const handleModalCloseConfirm = useCallback(() => {
    onClose && onClose()
  }, [onClose])

  const handleModalCloseCancel = useCallback(() => {
    setDisplayModalFormConfirm(false)
  }, [])

  return (
    <Modal closeable onClose={handleModalClose}>
      {displayModalCloseConfirm && (
        <Modal>
          <Column spacing="xl">
            <Title>Unsaved Claim</Title>
            <Text>
              Are you sure you want to close this modal? All unsaved changes will be lost and you will need to start
              over.
            </Text>
            <Row spacing="m" alignment="end">
              <Button variant="secondary" onClick={handleModalCloseCancel}>
                No, continue.
              </Button>
              <Button onClick={handleModalCloseConfirm}>Yes, close it.</Button>
            </Row>
          </Column>
        </Modal>
      )}
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
            label="EXPLOIT START BLOCK"
            error={blockResolveError && !isResolvingBlock}
            errorMessage="This is not a valid block number."
            detail={
              isResolvingBlock
                ? "Validating block ..."
                : exploitBlock
                ? `Block: #${exploitBlock.number} - ${DateTime.fromSeconds(exploitBlock.timestamp).toLocaleString(
                    DateTime.DATETIME_MED
                  )}`
                : ""
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
            <Input value={protocol.agreementHash} variant="small" disabled />
          </Field>
        </Row>

        <Row spacing="s">
          <Button
            onClick={handleSubmitClaim}
            fullWidth
            disabled={!claimIsValid || submittingClaim || !canStartNewClaim}
          >
            {submittingClaim ? "Submitting claim ..." : "Submit Claim"}
          </Button>
        </Row>
        {!canStartNewClaim && (
          <Row>
            <Text>Only the protocol's agent can start a new claim</Text>
          </Row>
        )}
      </Column>
    </Modal>
  )
}
