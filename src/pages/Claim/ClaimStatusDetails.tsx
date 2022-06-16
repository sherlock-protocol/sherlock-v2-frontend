import React from "react"
import { DateTime } from "luxon"

import { Claim, ClaimStatus, SPCC_REVIEW_DAYS, UMA_ESCALATION_DAYS } from "../../hooks/api/claims"
import { Text } from "../../components/Text"
import { Column, Row } from "../../components/Layout"
import { shortenAddress } from "../../utils/format"
import { useCurrentBlockTime } from "../../hooks/useCurrentBlockTime"

type Props = {
  claim: Claim
}

type ClaimStatusDetailsFn = React.FC<Props> & {
  SpccPending: React.FC<Props>
  SpccApproved: React.FC<Props>
  SpccDenied: React.FC<Props>
}

const statusMessages = {
  [ClaimStatus.SpccPending]: "Pending SPCC review",
  [ClaimStatus.SpccApproved]: "SPCC Approved",
  [ClaimStatus.SpccDenied]: "SPCC Denied",
  [ClaimStatus.UmaPriceProposed]: "",
  [ClaimStatus.ReadyToProposeUmaDispute]: "",
  [ClaimStatus.UmaDisputeProposed]: "",
  [ClaimStatus.UmaPending]: "Pendig UMA review",
  [ClaimStatus.UmaApproved]: "UMA Approved",
  [ClaimStatus.UmaDenied]: "UMA Denied",
  [ClaimStatus.Halted]: "Halted by UMA HO",
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

const SpccPending: React.FC<Props> = ({ claim }) => {
  const currentBlockTimestamp = useCurrentBlockTime()

  if (!currentBlockTimestamp) return null
  if (claim.status !== ClaimStatus.SpccPending) return null

  const spccDeadline = DateTime.fromSeconds(claim.createdAt).plus({ days: SPCC_REVIEW_DAYS })
  const now = DateTime.fromSeconds(currentBlockTimestamp)
  const isOverdue = spccDeadline < now
  const statusMessage = isOverdue ? "SPCC review overdue" : statusMessages[claim.status]

  return (
    <Column spacing="m">
      <Row alignment="space-between">
        <Column>
          <Text>Status</Text>
        </Column>
        <Column>
          <Text strong>{statusMessage}</Text>
        </Column>
      </Row>
      <Row alignment="space-between">
        <Column>
          <Text variant={isOverdue ? "secondary" : "primary"}>SPCC review deadline</Text>
        </Column>
        <Column>
          <Text strong variant={isOverdue ? "secondary" : "primary"}>
            {" "}
            {spccDeadline.toLocaleString(DateTime.DATETIME_MED)}
          </Text>
        </Column>
      </Row>
      {isOverdue && (
        <Row alignment="space-between">
          <Column>
            <Text>UMA escalation deadline</Text>
          </Column>
          <Column>
            <Text strong>
              {" "}
              {spccDeadline.plus({ days: UMA_ESCALATION_DAYS }).toLocaleString(DateTime.DATETIME_MED)}
            </Text>
          </Column>
        </Row>
      )}
    </Column>
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

ClaimStatusDetails.SpccPending = SpccPending
