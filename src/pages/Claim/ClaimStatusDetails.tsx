import React from "react"
import { DateTime } from "luxon"

import { Claim, ClaimStatus, SPCC_REVIEW_DAYS, UMA_ESCALATION_DAYS } from "../../hooks/api/claims"
import { Text } from "../../components/Text"
import { Column, Row } from "../../components/Layout"
import { shortenAddress } from "../../utils/format"

type Props = {
  claim: Claim
}

type ClaimStatusDetailsFn = React.FC<Props> & {
  SpccPending: React.FC<Props>
  SpccApproved: React.FC<Props>
  SpccDenied: React.FC<Props>
}

export const ClaimStatusDetails: ClaimStatusDetailsFn = (props) => {
  return (
    <>
      <ClaimStatusDetails.SpccPending {...props} />
      <ClaimStatusDetails.SpccApproved {...props} />
      <ClaimStatusDetails.SpccDenied {...props} />
    </>
  )
}

ClaimStatusDetails.SpccPending = ({ claim }) => {
  if (claim.status !== ClaimStatus.SpccPending) return null

  const spccDeadline = DateTime.fromSeconds(claim.createdAt).plus({ days: SPCC_REVIEW_DAYS })

  return (
    <Row alignment="space-between">
      <Column>
        <Text>SPCC review deadline</Text>
      </Column>
      <Column>
        <Text strong>{spccDeadline.toLocaleString(DateTime.DATETIME_MED)}</Text>
      </Column>
    </Row>
  )
}

ClaimStatusDetails.SpccApproved = ({ claim }) => {
  if (claim.status !== ClaimStatus.SpccApproved) return null

  return (
    <Row alignment="space-between">
      <Column>
        <Text>Receiver</Text>
      </Column>
      <Column>
        <Text strong>{shortenAddress(claim.receiver)}</Text>
      </Column>
    </Row>
  )
}

ClaimStatusDetails.SpccDenied = ({ claim }) => {
  if (claim.status !== ClaimStatus.SpccDenied) return null

  const spccDeniedTimestamp = claim.statusUpdates[0].timestamp
  const escalationDeadline = DateTime.fromSeconds(spccDeniedTimestamp).plus({ days: UMA_ESCALATION_DAYS })

  return (
    <Row alignment="space-between">
      <Column>
        <Text>UMA escalation deadline</Text>
      </Column>
      <Column>
        <Text strong>{escalationDeadline.toLocaleString(DateTime.DATETIME_MED)}</Text>
      </Column>
    </Row>
  )
}
