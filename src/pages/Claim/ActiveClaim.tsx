import React, { useCallback } from "react"
import { DateTime } from "luxon"
import { FaFileSignature, FaFileAlt, FaRegFileAlt } from "react-icons/fa"

import { Box } from "../../components/Box"
import { Text } from "../../components/Text"
import { Column, Row } from "../../components/Layout"
import { Button } from "../../components/Button"
import { Title } from "../../components/Title"
import { Claim, ClaimStatus } from "../../hooks/api/claims"
import { Protocol } from "../../hooks/api/protocols"
import { formatUSDC } from "../../utils/units"

import { ClaimStatusAction } from "./ClaimStatusAction"
import { ClaimStatusDetails } from "./ClaimStatusDetails"

import styles from "./Claims.module.scss"

type Props = {
  claim: Claim
  protocol: Protocol
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

export const ActiveClaim: React.FC<Props> = ({ claim, protocol }) => {
  const handleCoverageAgreementClick = useCallback(() => {
    if (!protocol.agreement) return

    window.open(protocol.agreement, "_blank")
  }, [protocol.agreement])

  const handleAdditionalEvidenceClick = useCallback(() => {
    if (!claim.additionalResourcesLink) return

    window.open(claim.additionalResourcesLink, "_blank")
  }, [claim.additionalResourcesLink])

  return (
    <Box shadow={false} className={styles.activeClaim} fixedWidth>
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
            <Text strong>{formatUSDC(claim.amount)} USDC</Text>
          </Column>
        </Row>

        {(protocol.agreement || claim.additionalResourcesLink) && (
          <Row spacing="m" alignment="space-between">
            {protocol.agreement && (
              <Column grow={0} shrink={0}>
                <Button variant="secondary" onClick={handleCoverageAgreementClick}>
                  <FaFileSignature /> <Text size="small">Coverage Agreement</Text>
                </Button>
              </Column>
            )}

            <Column grow={0} shrink={0}>
              <Button
                variant="secondary"
                onClick={handleAdditionalEvidenceClick}
                disabled={!claim.additionalResourcesLink}
              >
                {claim.additionalResourcesLink ? (
                  <>
                    <FaFileAlt /> <Text size="small">Additional evidence</Text>
                  </>
                ) : (
                  <>
                    <FaRegFileAlt /> <Text size="small">No additional evidence</Text>
                  </>
                )}
              </Button>
            </Column>
          </Row>
        )}

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
