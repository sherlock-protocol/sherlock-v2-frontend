import React, { useCallback } from "react"

import { Claim, ClaimStatus } from "../../hooks/api/claims"
import { Button } from "../../components/Button"
import { useClaimManager } from "../../hooks/useClaimManager"
import { ClaimStatusDetails } from "./ClaimStatusDetails"
import useWaitTx from "../../hooks/useWaitTx"
import { useAccount } from "wagmi"
import { Column, Row } from "../../components/Layout"
import { Text } from "../../components/Text"

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
      <ClaimStatusAction.Escalate {...props} />
      <ClaimStatusAction.Payout {...props} />
    </>
  )
}

const Escalate: React.FC<Props> = ({ claim }) => {
  if (claim.status !== ClaimStatus.SpccDenied) return null

  return <Button fullWidth>Escalate to UMA</Button>
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
            <Text size="small">Only the account which initiated the claim can execute the payout</Text>
          </Row>
          <Row>
            <Text size="small">{claim.initiator}</Text>
          </Row>
        </>
      )}
    </Column>
  )
}

ClaimStatusAction.Payout = Payout
ClaimStatusAction.Escalate = Escalate
