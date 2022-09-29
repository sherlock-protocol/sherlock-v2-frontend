import React, { useCallback, useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { Box } from "../../components/Box"
import { Button } from "../../components/Button"
import { Text } from "../../components/Text"
import { Protocol } from "../../hooks/api/protocols"
import { Column } from "../../components/Layout"
import { NewClaimModal } from "./NewClaimModal"
import useProtocolManager from "../../hooks/useProtocolManager"

type Props = {
  protocol: Protocol
}

export const StartNewClaimSection: React.FC<Props> = ({ protocol }) => {
  const { address: connectedAddress } = useAccount()
  const [isCreating, setIsCreating] = useState(false)
  const { getProtocolAgent } = useProtocolManager()
  const [canStartNewClaim, setCanStartNewClaim] = useState(false)

  useEffect(() => {
    const checkProtocolAgent = async () => {
      const protocolAgent = await getProtocolAgent(protocol.bytesIdentifier)

      setCanStartNewClaim(protocolAgent === connectedAddress)
    }

    checkProtocolAgent()
  }, [connectedAddress, getProtocolAgent, protocol.bytesIdentifier])

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
