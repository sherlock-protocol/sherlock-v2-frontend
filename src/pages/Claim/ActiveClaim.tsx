import React from "react"
import { ethers } from "ethers"
import { DateTime } from "luxon"

import { Box } from "../../components/Box"
import { Text } from "../../components/Text"
import { Claim, ClaimStatus } from "../../hooks/api/claims"
import { Column, Row } from "../../components/Layout"
import { commify } from "../../utils/units"
import { Title } from "../../components/Title"
import { ClaimStatusAction } from "./ClaimStatusAction"
import { ClaimStatusDetails } from "./ClaimStatusDetails"

import styles from "./Claims.module.scss"

type Props = {
  claim: Claim
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

export const ActiveClaim: React.FC<Props> = ({ claim }) => {
  return (
    <Box shadow={false}>
      <Column spacing="m">
        <Title>Active Claim</Title>
        <Row alignment="space-between">
          <Column>
            <Text>Submitted</Text>
          </Column>
          <Column>
            <Text strong>{DateTime.fromSeconds(claim.createdAt).toLocaleString(DateTime.DATETIME_MED)}</Text>
          </Column>
        </Row>
        {claim.exploitStartedAt && (
          <Row alignment="space-between">
            <Column>
              <Text>Exploit started</Text>
            </Column>
            <Column>
              <Text strong>{DateTime.fromSeconds(claim.exploitStartedAt).toLocaleString(DateTime.DATETIME_MED)}</Text>
            </Column>
          </Row>
        )}
        <Row alignment="space-between">
          <Column>
            <Text>Amount claimed</Text>
          </Column>
          <Column>
            <Text strong>{commify(ethers.utils.formatUnits(claim.amount, 6))} USDC</Text>
          </Column>
        </Row>

        <Column className={styles.claimStatusContainer} spacing="m">
          <Row alignment="space-between">
            <Column>
              <Text>Status</Text>
            </Column>
            <Column>
              <Text strong>{statusMessages[claim.status]}</Text>
            </Column>
          </Row>
          <ClaimStatusDetails claim={claim} />
          <ClaimStatusAction claim={claim} />
        </Column>
      </Column>
    </Box>
  )
}
