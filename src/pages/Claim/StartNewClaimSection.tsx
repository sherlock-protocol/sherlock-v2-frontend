import React, { useCallback, useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { Box } from "../../components/Box"
import { Button } from "../../components/Button"
import { Text } from "../../components/Text"
import { Protocol } from "../../hooks/api/protocols"
import { Column } from "../../components/Layout"
import { NewClaimModal } from "./NewClaimModal"
import { ethers } from "ethers"

type Props = {
  protocol: Protocol
}

export const StartNewClaimSection: React.FC<Props> = ({ protocol }) => {
  const [{ data: connectedAccount }] = useAccount()
  const [isCreating, setIsCreating] = useState(false)
  const [canStartNewClaim, setCanStartNewClaim] = useState(false)

  useEffect(() => {
    setCanStartNewClaim(
      !!connectedAccount?.address && ethers.utils.getAddress(connectedAccount.address) === protocol.agent
    )
  }, [connectedAccount?.address, protocol.agent])

  /**
   * Handler for start claim click
   */
  const toggleIsCreating = useCallback(async () => {
    setIsCreating((v) => !v)
  }, [setIsCreating])

  return (
    <Box shadow={false} fixedWidth>
      <Column spacing="m">
        <Button onClick={toggleIsCreating} disabled={!canStartNewClaim}>
          Start new claim
        </Button>

        {!canStartNewClaim && <Text size="small">Only the protocol's agent is allowed to start a new claim.</Text>}
      </Column>
      {isCreating && <NewClaimModal protocol={protocol} onClose={toggleIsCreating} />}
    </Box>
  )
}
