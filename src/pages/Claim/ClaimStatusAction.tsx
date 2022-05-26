import React from "react"

import { Claim, ClaimStatus } from "../../hooks/api/claims"
import { Button } from "../../components/Button"

type Props = {
  claim: Claim
}
type ClaimStatusActionFn = React.FC<Props> & {
  Nothing: React.FC<Props>
  Escalate: React.FC<Props>
  Payout: React.FC<Props>
}

export const ClaimStatusAction: ClaimStatusActionFn = (props) => {
  return (
    <>
      <ClaimStatusAction.Nothing {...props} />
      <ClaimStatusAction.Escalate {...props} />
      <ClaimStatusAction.Payout {...props} />
    </>
  )
}

ClaimStatusAction.Nothing = ({ claim }) => {
  if (claim.status !== ClaimStatus.SpccPending) return null

  return <Button fullWidth>Nothing to do here</Button>
}

ClaimStatusAction.Escalate = ({ claim }) => {
  if (claim.status !== ClaimStatus.SpccDenied) return null

  return <Button fullWidth>Escalate to UMA</Button>
}

ClaimStatusAction.Payout = ({ claim }) => {
  if (![ClaimStatus.SpccApproved, ClaimStatus.UmaApproved].includes(claim.status)) return null

  return <Button fullWidth>Claim payout</Button>
}
