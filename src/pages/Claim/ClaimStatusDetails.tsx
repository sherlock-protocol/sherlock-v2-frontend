import React from "react"
import { DateTime } from "luxon"

import { Claim, ClaimStatus } from "../../hooks/api/claims"
import { Text } from "../../components/Text"
import { Column, Row } from "../../components/Layout"
import { shortenAddress } from "../../utils/format"

const SPCC_REVIEW_DAYS = 7

type Props = {
  claim: Claim
}

type ClaimStatusDetailsFn = React.FC<Props> & {
  SpccPending: React.FC<Props>
  SpccApproved: React.FC<Props>
}

export const ClaimStatusDetails: ClaimStatusDetailsFn = (props) => {
  return (
    <>
      <ClaimStatusDetails.SpccPending {...props} />
      <ClaimStatusDetails.SpccApproved {...props} />
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
