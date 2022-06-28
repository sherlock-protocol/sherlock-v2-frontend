import React, { useCallback, useState } from "react"

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
  const { waitForTx } = useWaitTx()
  const currentBlockTimestamp = useCurrentBlockTime()
  const queryClient = useQueryClient()
  const { waitForBlock } = useWaitForBlock()

  const toggleCollapsed = useCallback(() => {
    setCollapsed((v) => !v)
  }, [setCollapsed])

  const handleEscalateClaim = useCallback(async () => {
    try {
      const txReceipt = await waitForTx(async () => await escalateClaim(claim.id, UMA_BOND))
      await waitForBlock(txReceipt.blockNumber)
      await queryClient.invalidateQueries(activeClaimQueryKey(claim.protocolID))

      return true
    } catch (e) {
      return false
    }
  }, [claim.id, escalateClaim, waitForTx])

  const handleCleanUpClaim = useCallback(async () => {
    try {
      const txReceipt = await waitForTx(async () => await cleanUpClaim(protocol.bytesIdentifier, claim.id))
      await waitForBlock(txReceipt.blockNumber)
      await queryClient.invalidateQueries(activeClaimQueryKey(protocol.id))

      return true
    } catch (e) {
      return false
    }
  }, [protocol.id, protocol.bytesIdentifier, claim.id, waitForTx, cleanUpClaim])

  if (!currentBlockTimestamp) return null

  const lastStatusUpdate = DateTime.fromSeconds(claim.statusUpdates[0].timestamp)

  const now = DateTime.fromSeconds(currentBlockTimestamp)
  const claimIsInEscalationStatus =
    claim.status === ClaimStatus.SpccDenied ||
    (claim.status === ClaimStatus.SpccPending && now > lastStatusUpdate.plus({ days: SPCC_REVIEW_DAYS }))

  if (!claimIsInEscalationStatus) return null

  const escalationWindowStartDate =
    claim.status === ClaimStatus.SpccDenied ? lastStatusUpdate : lastStatusUpdate.plus({ days: SPCC_REVIEW_DAYS })

  const connectedAccountIsClaimInitiator = connectedAccount?.address === claim.initiator
  const connectedAccountIsProtocolAgent = connectedAccount?.address === protocol.agent
  const withinUmaEscalationPeriod = now < escalationWindowStartDate.plus({ days: UMA_ESCALATION_DAYS })

  const canEscalate = connectedAccountIsClaimInitiator && withinUmaEscalationPeriod
  const canCleanUp = connectedAccountIsProtocolAgent

  return (
    <Column spacing="m">
      {!collapsed && (
        <Row alignment="space-between">
          <Column>
            <Text strong>UMA BOND</Text>
          </Column>
          <Column>
            <Text strong>{`${formatUSDC(UMA_BOND)} USDC`}</Text>
          </Column>
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
              <Button disabled={!canCleanUp} fullWidth variant="secondary" onClick={handleCleanUpClaim}>
                Clean Up Claim
              </Button>
            </Row>
          )}
        </>
      ) : (
        <Row>
          <AllowanceGate
            spender={claimManagerContractAddress}
            amount={UMA_BOND}
            action={handleEscalateClaim}
            actionName="Escalate"
          />
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
      {!withinUmaEscalationPeriod && (
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
  }, [claim.id, payoutClaim, waitForTx])

  if (![ClaimStatus.SpccApproved, ClaimStatus.UmaApproved].includes(claim.status)) return null
  if (!currentBlockTimestamp) return null

  let canClaimPayout = connectedAccount?.address === claim.initiator

  if (claim.status === ClaimStatus.UmaApproved) {
    const now = DateTime.fromSeconds(currentBlockTimestamp)
    canClaimPayout =
      canClaimPayout && now > DateTime.fromSeconds(claim.statusUpdates[0].timestamp).plus({ days: UMAHO_TIME_DAYS })
  }

  return (
    <Column spacing="m">
      <Row>
        <Button onClick={handleClaimPayoutClick} disabled={!canClaimPayout || isWaitingPayout} fullWidth>
          {isWaitingPayout ? "Claiming payout ..." : "Claim payout"}
        </Button>
      </Row>
      {connectedAccount?.address !== claim.initiator && (
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
