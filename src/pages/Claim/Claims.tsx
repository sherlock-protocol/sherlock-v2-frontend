import { BigNumber, ethers } from "ethers"
import { DateTime, Duration } from "luxon"
import React, { useCallback, useEffect } from "react"
import { Box } from "../../components/Box"
import { Button } from "../../components/Button/Button"
import { Column, Row } from "../../components/Layout"
import Select from "../../components/Select/Select"
import { Title } from "../../components/Title"
import { useCoveredProtocols, CoveredProtocol } from "../../hooks/api/useCoveredProtocols"
import { useClaimManager } from "../../hooks/useClaimManager"
import useWaitTx from "../../hooks/useWaitTx"

import styles from "./Claims.module.scss"

export const ClaimsPage: React.FC = () => {
  const [selectedProtocolId, setSelectedProtocolId] = React.useState<string>()
  const { data: coveredProtocols, getCoveredProtocols } = useCoveredProtocols()
  const { startClaim } = useClaimManager()
  const { waitForTx } = useWaitTx()

  // Fetch list of covered protocols
  useEffect(() => {
    getCoveredProtocols()
  }, [getCoveredProtocols])

  const protocolSelectOptions = React.useMemo(
    () =>
      Object.entries(coveredProtocols)?.map(([key, item]) => ({
        label: item.name ?? "Unknown",
        value: key,
      })) ?? [],
    [coveredProtocols]
  )

  const selectedProtocol = React.useMemo<CoveredProtocol | null>(
    () => (selectedProtocolId ? coveredProtocols?.[selectedProtocolId] ?? null : null),
    [selectedProtocolId, coveredProtocols]
  )

  /**
   * Handler for protocol's select option change
   */
  const handleProtocolChanged = useCallback((option: string) => {
    setSelectedProtocolId(option)
  }, [])

  /**
   * Handler for start claim click
   */
  const handleStartClaimClicked = useCallback(async () => {
    if (!selectedProtocol) return

    await waitForTx(
      async () =>
        await startClaim(
          selectedProtocol.bytesIdentifier,
          ethers.utils.parseEther("1000000"),
          "0x0B6a04b8D3d050cbeD9A4621A5D503F27743c942",
          DateTime.now().minus({ days: 10 }).toJSDate(),
          "ancilliary data hash"
        )
    )
  }, [startClaim, selectedProtocol, waitForTx])

  return (
    <Column spacing="m">
      <Box>
        <Column spacing="m">
          <Row alignment="space-between">
            <Column alignment={["center", "center"]}>
              <Title>Protocol</Title>
            </Column>
            <Column>
              <Select value={selectedProtocolId} options={protocolSelectOptions} onChange={handleProtocolChanged} />
            </Column>
          </Row>
        </Column>
      </Box>
      <Box shadow={false}>
        <Button onClick={handleStartClaimClicked}>Start claim</Button>
      </Box>
    </Column>
  )
}
