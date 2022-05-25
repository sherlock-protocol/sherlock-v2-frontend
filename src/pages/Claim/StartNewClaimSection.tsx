import React, { useCallback } from "react"
import { ethers } from "ethers"
import { DateTime } from "luxon"

import { Box } from "../../components/Box"
import { Button } from "../../components/Button/Button"
import { Protocol } from "../../hooks/api/protocols"
import { useClaimManager } from "../../hooks/useClaimManager"
import useWaitTx from "../../hooks/useWaitTx"

type Props = {
  protocol: Protocol
}

export const StartNewClaimSection: React.FC<Props> = ({ protocol }) => {
  const { waitForTx } = useWaitTx()
  const { startClaim } = useClaimManager()

  /**
   * Handler for start claim click
   */
  const handleStartClaimClicked = useCallback(async () => {
    await waitForTx(
      async () =>
        await startClaim(
          protocol.bytesIdentifier,
          ethers.utils.parseEther("1000000"),
          "0x0B6a04b8D3d050cbeD9A4621A5D503F27743c942",
          DateTime.now().minus({ days: 10 }).toJSDate(),
          "0x1213"
        )
    )
  }, [startClaim, protocol, waitForTx])

  return (
    <Box shadow={false}>
      <Button onClick={handleStartClaimClicked}>Start new claim</Button>
    </Box>
  )
}
