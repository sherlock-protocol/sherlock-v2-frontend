import React, { useCallback, useEffect, useMemo, useState } from "react"

import {
  Claim,
  ClaimStatus,
  UMA_ESCALATION_DAYS,
  SPCC_REVIEW_DAYS,
  UMA_BOND as UMA_MIN_BOND,
} from "../../hooks/api/claims"
import { Button } from "../../components/Button"
import { useClaimManager } from "../../hooks/useClaimManager"
import useWaitTx from "../../hooks/useWaitTx"
import { useAccount } from "wagmi"
import { Column, Row } from "../../components/Layout"
import { Text } from "../../components/Text"
import { shortenAddress } from "../../utils/format"
import { DateTime } from "luxon"
import TokenInput from "../../components/TokenInput/TokenInput"
import { Field } from "./Field"
import { BigNumber } from "ethers"
import { formatUSDC } from "../../utils/units"
import AllowanceGate from "../../components/AllowanceGate/AllowanceGate"

type Props = {
  claim: Claim
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

const Escalate: React.FC<Props> = ({ claim }) => {
  const [{ data: connectedAccount }] = useAccount()
  const [collapsed, setCollapsed] = useState(true)
  const [umaBond, setUmaBond] = useState<BigNumber | undefined>(UMA_MIN_BOND)
  const [isWaitingTx, setIsWaitingTx] = useState(false)
  const { escalateClaim, address: claimManagerContractAddress } = useClaimManager()
  const { waitForTx } = useWaitTx()

  const toggleCollapsed = useCallback(() => {
    setCollapsed((v) => !v)
  }, [setCollapsed])

  const handleEscalateClaim = useCallback(async () => {
    if (!umaBond) return

    setIsWaitingTx(true)

    try {
      await waitForTx(async () => await escalateClaim(claim.id, umaBond))
    } catch (e) {
    } finally {
      setIsWaitingTx(false)
    }
  }, [claim.id, escalateClaim, umaBond, waitForTx])

  const now = DateTime.now()
  const lastStatusUpdate = DateTime.fromSeconds(claim.statusUpdatedAt)

  const claimIsInEscalationStatus =
    claim.status === ClaimStatus.SpccDenied ||
    (claim.status === ClaimStatus.SpccPending && now > lastStatusUpdate.plus({ days: SPCC_REVIEW_DAYS }))

  if (!claimIsInEscalationStatus) return null

  const escalationWindowStartDate =
    claim.status === ClaimStatus.SpccDenied ? lastStatusUpdate : lastStatusUpdate.plus({ days: SPCC_REVIEW_DAYS })

  const connectedAccountIsClaimInitiator = connectedAccount?.address === claim.initiator
  const withinUmaEscalationPeriod = now < escalationWindowStartDate.plus({ days: UMA_ESCALATION_DAYS })

  const umaBondIsValid = !!umaBond?.gte(UMA_MIN_BOND)

  const canEscalate = connectedAccountIsClaimInitiator && withinUmaEscalationPeriod && umaBondIsValid

  return (
    <Column spacing="m">
      {!collapsed && (
        <Row>
          <Field
            label="UMA BOND"
            error={!umaBondIsValid}
            errorMessage={`The bond must be >= ${formatUSDC(UMA_MIN_BOND)} USDC`}
          >
            <TokenInput token="USDC" onChange={setUmaBond} initialValue={UMA_MIN_BOND} />
          </Field>
        </Row>
      )}
      <Row>
        {collapsed ? (
          <Button disabled={!canEscalate} fullWidth onClick={toggleCollapsed}>
            Escalate to UMA
          </Button>
        ) : (
          <AllowanceGate
            spender={claimManagerContractAddress}
            amount={umaBond}
            action={handleEscalateClaim}
            actionName="Escalate"
          />
        )}
      </Row>
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

  const handleClaimPayoutClick = useCallback(async () => {
    await waitForTx(async () => await payoutClaim(claim.id))
  }, [claim.id, payoutClaim, waitForTx])

  if (![ClaimStatus.SpccApproved, ClaimStatus.UmaApproved].includes(claim.status)) return null

  /**
   * Only protocol's agent is allowed to start a new claim
   */
  const canClaimPayout = connectedAccount?.address === claim.initiator

  return (
    <Column spacing="m">
      <Row>
        <Button onClick={handleClaimPayoutClick} disabled={!canClaimPayout} fullWidth>
          Claim payout
        </Button>
      </Row>
      {!canClaimPayout && (
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
