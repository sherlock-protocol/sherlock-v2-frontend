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
  SpccOverdue: React.FC<Props>
  UmaOverdue: React.FC<Props>
  UmaPending: React.FC<Props>
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

function getSPCCDeadline(claim: Claim) {
  return DateTime.fromSeconds(claim.createdAt).plus({ days: SPCC_REVIEW_DAYS })
}

function getUMADeadline(claim: Claim) {
  if (claim.status === ClaimStatus.SpccDenied || claim.status === ClaimStatus.SpccPending) {
    return DateTime.fromSeconds(claim.statusUpdates[0].timestamp).plus({ days: UMA_ESCALATION_DAYS })
  }

  return undefined
}

export const ClaimStatusDetails: ClaimStatusDetailsFn = (props) => {
  return (
    <>
      <ClaimStatusDetails.SpccPending {...props} />
      <ClaimStatusDetails.SpccApproved {...props} />
      <ClaimStatusDetails.SpccDenied {...props} />
      <ClaimStatusDetails.SpccOverdue {...props} />
      <ClaimStatusDetails.UmaOverdue {...props} />
      <ClaimStatusDetails.UmaPending {...props} />
    </>
  )
}

const SpccPending: React.FC<Props> = ({ claim }) => {
  const currentBlockTimestamp = useCurrentBlockTime()
  if (!currentBlockTimestamp) return null

  const spccDeadline = getSPCCDeadline(claim)
  const now = DateTime.fromSeconds(currentBlockTimestamp)

  if (claim.status !== ClaimStatus.SpccPending || spccDeadline < now) return null

  return (
    <Column spacing="m">
      <Row alignment="space-between">
        <Column>
          <Text>Status</Text>
        </Column>
        <Column>
          <Text strong>{statusMessages[claim.status]}</Text>
        </Column>
      </Row>
      <Row alignment="space-between">
        <Column>
          <Text>SPCC review deadline</Text>
        </Column>
        <Column>
          <Text strong>{spccDeadline.toLocaleString(DateTime.DATETIME_MED)}</Text>
        </Column>
      </Row>
    </Column>
  )
}

const SpccApproved: React.FC<Props> = ({ claim }) => {
  if (claim.status !== ClaimStatus.SpccApproved) return null

  return (
    <Column spacing="m">
      <Row alignment="space-between">
        <Column>
          <Text>Status</Text>
        </Column>
        <Column>
          <Text strong>{statusMessages[claim.status]}</Text>
        </Column>
      </Row>
      <Row alignment="space-between">
        <Column>
          <Text>Receiver</Text>
        </Column>
        <Column>
          <Text strong>{shortenAddress(claim.receiver)}</Text>
        </Column>
      </Row>
    </Column>
  )
}

const SpccDenied: React.FC<Props> = ({ claim }) => {
  if (claim.status !== ClaimStatus.SpccDenied) return null

  const spccDeniedTimestamp = claim.statusUpdates[0].timestamp
  const escalationDeadline = DateTime.fromSeconds(spccDeniedTimestamp).plus({ days: UMA_ESCALATION_DAYS })

  return (
    <Column spacing="m">
      <Row alignment="space-between">
        <Column>
          <Text>Status</Text>
        </Column>
        <Column>
          <Text strong>{statusMessages[claim.status]}</Text>
        </Column>
      </Row>
      <Row alignment="space-between">
        <Column>
          <Text>UMA escalation deadline</Text>
        </Column>
        <Column>
          <Text strong>{escalationDeadline.toLocaleString(DateTime.DATETIME_MED)}</Text>
        </Column>
      </Row>
    </Column>
  )
}

const SpccOverdue: React.FC<Props> = ({ claim }) => {
  const currentBlockTimestamp = useCurrentBlockTime()

  if (!currentBlockTimestamp) return null

  const spccDeadline = getSPCCDeadline(claim)
  const umaDeadline = getUMADeadline(claim)
  const now = DateTime.fromSeconds(currentBlockTimestamp)

  if (claim.status !== ClaimStatus.SpccPending || spccDeadline > now || (umaDeadline && now > umaDeadline)) return null

  return (
    <Column spacing="m">
      <Row alignment="space-between">
        <Column>
          <Text>Status</Text>
        </Column>
        <Column>
          <Text strong>SPCC review overdue</Text>
        </Column>
      </Row>
      <Row alignment="space-between">
        <Column>
          <Text variant="secondary">SPCC review deadline</Text>
        </Column>
        <Column>
          <Text strong variant="secondary">
            {spccDeadline.toLocaleString(DateTime.DATETIME_MED)}
          </Text>
        </Column>
      </Row>
      <Row alignment="space-between">
        <Column>
          <Text>UMA escalation deadline</Text>
        </Column>
        <Column>
          <Text strong>{spccDeadline.plus({ days: UMA_ESCALATION_DAYS }).toLocaleString(DateTime.DATETIME_MED)}</Text>
        </Column>
      </Row>
    </Column>
  )
}

const UmaOverdue: React.FC<Props> = ({ claim }) => {
  const currentBlockTimestamp = useCurrentBlockTime()

  if (!currentBlockTimestamp) return null

  const spccDeadline = getSPCCDeadline(claim)
  const umaDeadline = getUMADeadline(claim)
  const now = DateTime.fromSeconds(currentBlockTimestamp)

  if (![ClaimStatus.SpccDenied, ClaimStatus.SpccPending].includes(claim.status) || spccDeadline > now || !umaDeadline)
    return null

  return (
    <Column spacing="m">
      <Row alignment="space-between">
        <Column>
          <Text>Status</Text>
        </Column>
        <Column>
          <Text strong>UMA escalation overdue</Text>
        </Column>
      </Row>
      <Row alignment="space-between">
        <Column>
          <Text variant="secondary">UMA escalation deadline</Text>
        </Column>
        <Column>
          <Text strong variant="secondary">
            {umaDeadline.toLocaleString(DateTime.DATETIME_MED)}
          </Text>
        </Column>
      </Row>
    </Column>
  )
}

const UmaReviewPending: React.FC<Props> = ({ claim }) => {
  if (claim.status !== ClaimStatus.UmaPending) return null

  return (
    <Column spacing="m">
      <Row alignment="space-between">
        <Column>
          <Text>Status</Text>
        </Column>
        <Column>
          <Text strong>UMA review pending</Text>
        </Column>
      </Row>
    </Column>
  )
}

ClaimStatusDetails.SpccPending = SpccPending
ClaimStatusDetails.SpccApproved = SpccApproved
ClaimStatusDetails.SpccDenied = SpccDenied
ClaimStatusDetails.SpccOverdue = SpccOverdue
ClaimStatusDetails.UmaOverdue = UmaOverdue
ClaimStatusDetails.UmaPending = UmaReviewPending
