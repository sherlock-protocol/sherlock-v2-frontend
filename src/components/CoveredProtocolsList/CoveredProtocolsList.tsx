import React, { useEffect, useMemo } from "react"
import { Box } from "../Box"
import { Title } from "../Title"
import { useCoveredProtocols } from "../../hooks/api/useCoveredProtocols"
import { Text } from "../Text"
import { formatAmount } from "../../utils/format"
import { ethers } from "ethers"
import styles from "./CoveredProtocolsList.module.scss"
import { useTVCOverTime } from "../../hooks/api/useTVCOverTime"
import { Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, VStack } from "@chakra-ui/react"

/**
 * List of covered protocols
 */
const CoveredProtocolsList: React.FC = () => {
  const { getCoveredProtocols, data: coveredProtocolsData } = useCoveredProtocols()
  const { getTVCOverTime, data: tvcData } = useTVCOverTime()

  useEffect(() => {
    getCoveredProtocols()
    getTVCOverTime()
  }, [getCoveredProtocols, getTVCOverTime])

  // Total Value Covered
  const tvc = useMemo(() => {
    if (tvcData) {
      return tvcData?.length > 0 ? tvcData[tvcData.length - 1].value : undefined
    }
  }, [tvcData])

  const protocolsData = useMemo(() => {
    if (!coveredProtocolsData || !tvc) {
      return []
    }

    // Filter only protocols with active coverage
    const activeProtocols = Object.entries(coveredProtocolsData)
      .map((item) => item[1])
      .filter((item) => !item.coverageEndedAt)

    // Compute each protocol's max claimable amount
    const protocolsWithCoverages =
      activeProtocols.map((item) => {
        const [current, previous] = item.coverages.map((item) => item.coverageAmount)
        const maxClaimableAmount = previous?.gt(current) ? previous : current
        const coverage = item.tvl?.lt(maxClaimableAmount) ? item.tvl : maxClaimableAmount

        const percentageOfTotal = +((coverage.div(1e6).toNumber() * 100) / tvc.div(1e6).toNumber()).toFixed(0)

        return {
          id: item.bytesIdentifier,
          name: item.name,
          website: item.website,
          coverage,
          percentageOfTotal,
        }
      }) ?? []

    // Sort protocols descending
    const sortedProtocols = protocolsWithCoverages.sort((a, b) => b.percentageOfTotal - a.percentageOfTotal)

    // Fix rounding errors so percentages add up to 100%
    const totalPercentages = sortedProtocols.reduce((value, item) => item.percentageOfTotal + value, 0)
    if (totalPercentages > 100) {
      const delta = totalPercentages - 100
      sortedProtocols[sortedProtocols.length - 1].percentageOfTotal -= delta
    }

    return sortedProtocols
  }, [coveredProtocolsData, tvc])

  return (
    <Box shadow={false} fullWidth>
      <VStack w="full" spacing={4} alignItems="flex-start">
        <Title variant="h3">COVERED PROTOCOLS</Title>
        <Title>{protocolsData?.length}</Title>
      </VStack>
      <TableContainer>
        <Table variant="dashboard">
          <Thead>
            <Tr>
              <Th>Protocol</Th>
              <Th isNumeric>Coverage</Th>
              <Th isNumeric>%</Th>
            </Tr>
          </Thead>
          <Tbody>
            {protocolsData?.map((item) => (
              <Tr key={item.id}>
                <Td>
                  <a href={item.website} target="_blank" rel="noopener noreferrer">
                    <Text strong className={styles.protocolName}>
                      {item.name}
                    </Text>
                  </a>
                </Td>
                <Td isNumeric>
                  <Text>${formatAmount(ethers.utils.formatUnits(item.coverage, 6), 0)}</Text>
                </Td>
                <Td isNumeric>
                  <Text>{item.percentageOfTotal.toFixed(0)}%</Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
          {tvc && (
            <Tfoot className={styles.footer}>
              <Tr>
                <Td>
                  <Text strong>Total Value Covered</Text>
                </Td>
                <Td isNumeric>
                  <Text>${formatAmount(ethers.utils.formatUnits(tvc, 6), 0)}</Text>
                </Td>
                <Td>&nbsp;</Td>
              </Tr>
            </Tfoot>
          )}
        </Table>
      </TableContainer>
    </Box>
  )
}

export default CoveredProtocolsList
