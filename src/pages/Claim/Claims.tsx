import React, { useCallback, useMemo, useState } from "react"

import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import Select from "../../components/Select/Select"
import { Title } from "../../components/Title"
import { useProtocols, Protocol } from "../../hooks/api/protocols"
import { useActiveClaim } from "../../hooks/api/claims"

import { StartNewClaimSection } from "./StartNewClaimSection"
import { ActiveClaim } from "./ActiveClaim"

export const ClaimsPage: React.FC = () => {
  const [selectedProtocolBytesIdentifier, setSelectedProtocolBytesIdentifier] = useState<string>()
  const { data: protocols } = useProtocols()

  const selectedProtocol = useMemo<Protocol | null>(
    () => (selectedProtocolBytesIdentifier ? protocols?.[selectedProtocolBytesIdentifier] ?? null : null),
    [selectedProtocolBytesIdentifier, protocols]
  )

  const { data: activeClaim, isLoading: isLoadingActiveClaim } = useActiveClaim(selectedProtocol?.id ?? 0, {
    enabled: !!selectedProtocol,
  })

  const protocolSelectOptions = useMemo(
    () =>
      (protocols &&
        Object.entries(protocols).map(([_, p]) => ({
          label: p.name ?? "Unknown",
          value: p.bytesIdentifier,
        }))) ??
      [],
    [protocols]
  )

  /**
   * Handler for protocol's select option change
   */
  const handleProtocolChanged = useCallback((option: string) => {
    setSelectedProtocolBytesIdentifier(option)
  }, [])

  /**
   * There're multiple scenarios depending on wether an active claim exists or not.
   *
   * isLoadingActiveClaim === true => indexer is being fetched
   * activeClaim === null => the protocol doesn't have an active claim
   * activeClaim === undefined => this is the initial state, indexer hasn't been fetched yet
   *
   */
  const renderClaimSection = useCallback(() => {
    if (!selectedProtocol) return null

    // Active claim fetched, but no results => Protocol doesn't have an active claim.
    if (activeClaim === null) return <StartNewClaimSection protocol={selectedProtocol} />
    // Active claim fetched and found one active claim.
    if (activeClaim) return <ActiveClaim claim={activeClaim} protocol={selectedProtocol} />
    // Active claim fetch is loading.
    if (isLoadingActiveClaim) return <Box shadow={false}></Box>
  }, [activeClaim, isLoadingActiveClaim, selectedProtocol])

  return (
    <Column spacing="m">
      <Box shadow={false}>
        <Column spacing="m">
          <Row alignment="space-between">
            <Column alignment={["center", "center"]}>
              <Title>Protocol</Title>
            </Column>
            <Column>
              <Select
                value={selectedProtocolBytesIdentifier}
                placeholder="Select protocol"
                options={protocolSelectOptions}
                onChange={handleProtocolChanged}
              />
            </Column>
          </Row>
        </Column>
      </Box>
      {renderClaimSection()}
    </Column>
  )
}
