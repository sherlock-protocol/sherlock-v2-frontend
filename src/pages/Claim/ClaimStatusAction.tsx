import React, { useCallback, useEffect, useState } from "react"

import {
  Claim,
  ClaimStatus,
  UMA_ESCALATION_DAYS,
  SPCC_REVIEW_DAYS,
  UMA_BOND,
  activeClaimQueryKey,
  UMAHO_TIME_DAYS,
} from "../../hooks/api/claims"
import { Button } from "../../components/Button"
import { useClaimManager } from "../../hooks/useClaimManager"
import useWaitTx from "../../hooks/useWaitTx"
import { useAccount } from "wagmi"
import { Column, Row } from "../../components/Layout"
import { Text } from "../../components/Text"
import { shortenAddress } from "../../utils/format"
import { DateTime } from "luxon"
import { formatUSDC } from "../../utils/units"
import AllowanceGate from "../../components/AllowanceGate/AllowanceGate"
import { useCurrentBlockTime } from "../../hooks/useCurrentBlockTime"
import { useWaitForBlock } from "../../hooks/api/useWaitForBlock"
import { useQueryClient } from "react-query"
import { Protocol } from "../../hooks/api/protocols"
import useERC20 from "../../hooks/useERC20"
import { ethers } from "ethers"

type Props = {
  claim: Claim
  protocol: Protocol
}
type ClaimStatusActionFn = React.FC<Props> & {
  Escalate: React.FC<Props>
  Payout: React.FC<Props>
}

export const ClaimStatusAction: ClaimStatusActionFn = (props) => {
  return (
    <>
      <ClaimStatusAction.Payout {...props} />
      <ClaimStatusAction.Escalate {...props} />
    </>
  )
}

const Escalate: React.FC<Props> = ({ claim, protocol }) => {
  const [{ data: connectedAccount }] = useAccount()
  const [collapsed, setCollapsed] = useState(true)
  const { escalateClaim, address: claimManagerContractAddress, cleanUpClaim } = useClaimManager()
  const { balance } = useERC20("USDC")
  const { waitForTx } = useWaitTx()
  const currentBlockTimestamp = useCurrentBlockTime()
  const queryClient = useQueryClient()
  const { waitForBlock } = useWaitForBlock()

  const [isWithinUmaEscalationPeriod, setIsWithinUmaEscalationPeriod] = useState(false)
  const [connectedAccountIsClaimInitiator, setConnectedAccountIsClaimInitiator] = useState(false)
  const [accountHasEnoughBalance, setAccountHasEnoughBalance] = useState(false)
  const [canEscalate, setCanEscalate] = useState(false)
  const [canCleanUp, setCanCleanUp] = useState(false)

  const [isWaitingTx, setIsWaitingTx] = useState(false)

  useEffect(() => {
    setConnectedAccountIsClaimInitiator(
      !!connectedAccount?.address && ethers.utils.getAddress(connectedAccount.address) === claim.initiator
    )
  }, [connectedAccount?.address, claim.initiator])

  useEffect(() => {
    setAccountHasEnoughBalance(!!balance && balance > UMA_BOND)
  }, [balance])

  useEffect(() => {
    const now = currentBlockTimestamp && DateTime.fromSeconds(currentBlockTimestamp)
    const lastStatusUpdate = DateTime.fromSeconds(claim.statusUpdates[0].timestamp)
    const escalationWindowStartDate =
      claim.status === ClaimStatus.SpccDenied ? lastStatusUpdate : lastStatusUpdate.plus({ days: SPCC_REVIEW_DAYS })

    setIsWithinUmaEscalationPeriod(!!now && now < escalationWindowStartDate.plus({ days: UMA_ESCALATION_DAYS }))
  }, [claim, currentBlockTimestamp])

  useEffect(() => {
    setCanEscalate(connectedAccountIsClaimInitiator && isWithinUmaEscalationPeriod && accountHasEnoughBalance)
  }, [connectedAccountIsClaimInitiator, isWithinUmaEscalationPeriod, accountHasEnoughBalance])

  useEffect(() => {
    setCanCleanUp(!!connectedAccount?.address && ethers.utils.getAddress(connectedAccount.address) === protocol.agent)
  }, [connectedAccount?.address, protocol.agent])

  const toggleCollapsed = useCallback(() => {
    setCollapsed((v) => !v)
  }, [setCollapsed])

  const handleEscalateClaim = useCallback(async () => {
    try {
      setIsWaitingTx(true)
      const txReceipt = await waitForTx(async () => await escalateClaim(claim.id, UMA_BOND))
      await waitForBlock(txReceipt.blockNumber)
      await queryClient.invalidateQueries(activeClaimQueryKey(claim.protocolID))

      return true
    } catch (e) {
      return false
    } finally {
      setIsWaitingTx(false)
    }
  }, [claim.id, claim.protocolID, escalateClaim, waitForTx, waitForBlock, queryClient])

  const handleCleanUpClaim = useCallback(async () => {
    try {
      setIsWaitingTx(true)
      const txReceipt = await waitForTx(async () => await cleanUpClaim(protocol.bytesIdentifier, claim.id))
      await waitForBlock(txReceipt.blockNumber)
      await queryClient.invalidateQueries(activeClaimQueryKey(protocol.id))

      return true
    } catch (e) {
      return false
    } finally {
      setIsWaitingTx(false)
    }
  }, [protocol.id, protocol.bytesIdentifier, claim.id, waitForTx, cleanUpClaim, waitForBlock, queryClient])

  if (!currentBlockTimestamp) return null

  const now = currentBlockTimestamp && DateTime.fromSeconds(currentBlockTimestamp)
  const lastStatusUpdate = DateTime.fromSeconds(claim.statusUpdates[0].timestamp)
  const claimIsInEscalationStatus =
    claim.status === ClaimStatus.SpccDenied ||
    (claim.status === ClaimStatus.SpccPending && now && now > lastStatusUpdate.plus({ days: SPCC_REVIEW_DAYS }))

  if (!claimIsInEscalationStatus) return null

  return (
    <Column spacing="m">
      <Row alignment="space-between">
        <Column>
          <Text strong>UMA BOND</Text>
        </Column>
        <Column>
          <Text strong>{`${formatUSDC(UMA_BOND)} USDC`}</Text>
        </Column>
      </Row>
      {!accountHasEnoughBalance && (
        <Row>
          <Text variant="warning">There's not enough balance is this account to escalate the claim.</Text>
        </Row>
      )}
      {collapsed ? (
        <>
          <Row>
            <Button disabled={!canEscalate} fullWidth onClick={toggleCollapsed}>
              Escalate to UMA
            </Button>
          </Row>
          {canCleanUp && (
            <Row>
              <Button disabled={!canCleanUp || isWaitingTx} fullWidth variant="secondary" onClick={handleCleanUpClaim}>
                {isWaitingTx ? "Accepting claim resolution ..." : "Accept claim resolution"}
              </Button>
            </Row>
          )}
        </>
      ) : (
        <Row>
          {isWaitingTx ? (
            <Text>Escalating claim ...</Text>
          ) : (
            <AllowanceGate
              spender={claimManagerContractAddress}
              amount={UMA_BOND}
              action={handleEscalateClaim}
              actionName="Escalate"
            />
          )}
        </Row>
      )}
      {!connectedAccountIsClaimInitiator && (
        <>
          <Row>
            <Text size="small">Only the claim inintiator can escalate it to UMA.</Text>
          </Row>
          <Row>
            <Text size="small">Please connnect using account with address {shortenAddress(claim.initiator)}</Text>
          </Row>
        </>
      )}
      {!isWithinUmaEscalationPeriod && (
        <Row>
          <Text variant="warning" size="small">
            UMA escalation deadline passed. This claim cannot be escalated anymore.
          </Text>
        </Row>
      )}
    </Column>
  )
}

const Payout: React.FC<Props> = ({ claim }) => {
  const [{ data: connectedAccount }] = useAccount()
  const { payoutClaim } = useClaimManager()
  const { waitForTx } = useWaitTx()
  const { waitForBlock } = useWaitForBlock()
  const [isWaitingPayout, setIsWaitingPayout] = useState(false)
  const queryClient = useQueryClient()
  const currentBlockTimestamp = useCurrentBlockTime()

  const [accountIsClaimInitiator, setAccountIsClaimInitiator] = useState(false)
  const [canClaimPayout, setCanClaimPayout] = useState(false)

  useEffect(() => {
    setAccountIsClaimInitiator(
      !!connectedAccount?.address && ethers.utils.getAddress(connectedAccount.address) === claim.initiator
    )
  }, [connectedAccount?.address, claim])

  useEffect(() => {
    if (claim.status === ClaimStatus.UmaApproved) {
      const now = currentBlockTimestamp && DateTime.fromSeconds(currentBlockTimestamp)
      setCanClaimPayout(
        accountIsClaimInitiator &&
          !!now &&
          now > DateTime.fromSeconds(claim.statusUpdates[0].timestamp).plus({ days: UMAHO_TIME_DAYS })
      )
    } else {
      setCanClaimPayout(accountIsClaimInitiator)
    }
  }, [accountIsClaimInitiator, setCanClaimPayout, claim.status, claim.statusUpdates, currentBlockTimestamp])

  const handleClaimPayoutClick = useCallback(async () => {
    try {
      setIsWaitingPayout(true)

      const txReceipt = await waitForTx(async () => await payoutClaim(claim.id))

      await waitForBlock(txReceipt.blockNumber)

      await queryClient.invalidateQueries(activeClaimQueryKey(claim.protocolID))
    } catch (e) {
    } finally {
      setIsWaitingPayout(false)
    }
  }, [claim.id, claim.protocolID, payoutClaim, waitForTx, setIsWaitingPayout, queryClient, waitForBlock])

  if (![ClaimStatus.SpccApproved, ClaimStatus.UmaApproved].includes(claim.status)) return null
  if (!currentBlockTimestamp) return null

  return (
    <Column spacing="m">
      <Row>
        <Button onClick={handleClaimPayoutClick} disabled={!canClaimPayout || isWaitingPayout} fullWidth>
          {isWaitingPayout ? "Claiming payout ..." : "Claim payout"}
        </Button>
      </Row>
      {!accountIsClaimInitiator && (
        <>
          <Row>
            <Text size="small">Only the claim inintiator can execute the payout.</Text>
          </Row>
          <Row>
            <Text size="small">Please connnect using account with address {shortenAddress(claim.initiator)}</Text>
          </Row>
        </>
      )}
    </Column>
  )
}

ClaimStatusAction.Payout = Payout
ClaimStatusAction.Escalate = Escalate
