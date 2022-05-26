import React, { useCallback } from "react"
import { ethers } from "ethers"
import { DateTime } from "luxon"

import { Box } from "../../components/Box"
import { Text } from "../../components/Text"
import { Claim } from "../../hooks/api/claims"
import { Column } from "../../components/Layout"
import { commify } from "../../utils/units"

type Props = {
  claim: Claim
}

export const ActiveClaim: React.FC<Props> = ({ claim }) => {
  return (
    <Box shadow={false}>
      <Column spacing="m">
        <Text>This protocol already has an active claim</Text>
        <Text>Claim submitted: {DateTime.fromSeconds(claim.createdAt).toLocaleString(DateTime.DATETIME_FULL)}</Text>
        {claim.exploitStartedAt && (
          <Text>
            Exploit started: {DateTime.fromSeconds(claim.exploitStartedAt).toLocaleString(DateTime.DATETIME_FULL)}
          </Text>
        )}
        <Text>Amount: {commify(ethers.utils.formatUnits(claim.amount, 6))} USDC</Text>
        <Text>Status {claim.status}</Text>
      </Column>
    </Box>
  )
}
