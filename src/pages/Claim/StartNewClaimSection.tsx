import React, { useCallback } from "react"
import { ethers } from "ethers"
import { DateTime } from "luxon"
import { useAccount } from "wagmi"

import { Box } from "../../components/Box"
import { Button } from "../../components/Button"
import { Text } from "../../components/Text"
import { Protocol } from "../../hooks/api/protocols"
import { useClaimManager } from "../../hooks/useClaimManager"
import useWaitTx from "../../hooks/useWaitTx"
import { Column } from "../../components/Layout"

type Props = {
  protocol: Protocol
}

export const StartNewClaimSection: React.FC<Props> = ({ protocol }) => {
  const [{ data: connectedAccount }] = useAccount()
  const { waitForTx } = useWaitTx()
  const { startClaim } = useClaimManager()

  /**
   * Handler for start claim click
   */
  const handleStartClaimClicked = useCallback(async () => {
    if (!connectedAccount?.address) return

    await waitForTx(
      async () =>
        await startClaim(
          protocol.bytesIdentifier,
          ethers.utils.parseEther("1000000"),
          connectedAccount.address,
          DateTime.now().minus({ days: 10 }).toJSDate(),
          "0x121330"
        )
    )
  }, [startClaim, protocol, waitForTx, connectedAccount?.address])

  /**
   * Only protocol's agent is allowed to start a new claim
   */
  const canStartNewClaim = connectedAccount?.address === protocol.agent

  return (
    <Box shadow={false}>
      <Column spacing="m">
        <Text size="normal" strong>
          {protocol.name} has no active claim.
        </Text>
        <Button onClick={handleStartClaimClicked} disabled={!canStartNewClaim}>
          Start new claim
        </Button>

        {!canStartNewClaim && <Text size="small">Only the protocol's agent is allowed to start a new claim.</Text>}
      </Column>
    </Box>
  )
}
