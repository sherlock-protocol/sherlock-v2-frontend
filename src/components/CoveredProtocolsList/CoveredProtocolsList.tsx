import React, { useMemo } from "react"
import { Box } from "../Box"
import { Column, Row } from "../Layout"
import { Title } from "../Title"
import { useProtocols } from "../../hooks/api/protocols"
import { Text } from "../Text"
import { formatAmount } from "../../utils/format"
import { ethers } from "ethers"
import styles from "./CoveredProtocolsList.module.scss"
import cx from "classnames"
import { useTVCOverTime } from "../../hooks/api/stats"

/**
 * List of covered protocols
 */
const CoveredProtocolsList: React.FC = () => {
  const { data: tvcData } = useTVCOverTime()
  const { data: protocols } = useProtocols()

  // Total Value Covered
  const tvc = useMemo(() => {
    if (tvcData) {
      return tvcData?.length > 0 ? tvcData[tvcData.length - 1].value : undefined
    }
  }, [tvcData])

  const protocolsData = useMemo(() => {
    if (!protocols || !tvc || Object.keys(protocols).length === 0) {
      return []
    }

    // Filter only protocols with active coverage
    const activeProtocols = Object.entries(protocols)
      .map((item) => item[1])
      .filter((item) => !item.coverageEndedAt)

    // Compute each protocol's max claimable amount
    const protocolsWithCoverages =
      activeProtocols.map((item) => {
        const [current, previous] = item.coverages.map((item) => item.coverageAmount)
        const maxClaimableAmount = previous?.gt(current) ? previous : current
        const coverage = item.tvl?.lt(maxClaimableAmount) ? item.tvl : maxClaimableAmount

        const percentageOfTotal = +((coverage.div(1e6).toNumber() * 100) / tvc.div(1e6).toNumber()).toFixed(2)

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
    if (totalPercentages !== 100) {
      const delta = totalPercentages - 100
      sortedProtocols[sortedProtocols.length - 1].percentageOfTotal -= delta
    }

    return sortedProtocols
  }, [protocols, tvc])

  return (
    <Box shadow={false} fullWidth>
      <Column spacing="m">
        <Row>
          <Title variant="h3">COVERED PROTOCOLS</Title>
        </Row>
        <Row>
          <Title>{protocolsData?.length}</Title>
        </Row>
        <Row alignment="center">
          <Column grow={1} spacing="xs">
            <Row className={styles.header}>
              <Column className={styles.listColumn}>
                <Text strong>Protocol</Text>
              </Column>
              <Column alignment="end" className={styles.listColumn}>
                <Text strong>Coverage</Text>
              </Column>
              <Column className={styles.listColumn} grow={1}></Column>
              <Column className={styles.listColumn}>
                <Text strong>%</Text>
              </Column>
            </Row>
            <Column grow={1} spacing="xs" className={styles.listContainer}>
              {protocolsData?.map((item) => (
                <Row key={item.id}>
                  <Column className={cx(styles.listColumn, styles.entry)}>
                    <a href={item.website} target="_blank" rel="noopener noreferrer">
                      <Text strong className={styles.protocolName}>
                        {item.name}
                      </Text>
                    </a>
                  </Column>
                  <Column alignment="end" className={cx(styles.listColumn, styles.entry)}>
                    <Text>${formatAmount(ethers.utils.formatUnits(item.coverage, 6), 0)}</Text>
                  </Column>
                  <Column className={cx(styles.listColumn, styles.entry)} grow={1}></Column>
                  <Column className={cx(styles.listColumn, styles.entry)}>
                    <Text>{item.percentageOfTotal.toFixed(2)}%</Text>
                  </Column>
                </Row>
              ))}
              {tvc && (
                <Row className={styles.header}>
                  <Column className={styles.listColumn}>
                    <Text strong>Total Value Covered</Text>
                  </Column>
                  <Column alignment="end" className={styles.listColumn}>
                    <Text>${formatAmount(ethers.utils.formatUnits(tvc, 6), 0)}</Text>
                  </Column>
                  <Column className={styles.listColumn} grow={1}></Column>
                  <Column className={styles.listColumn}></Column>
                </Row>
              )}
            </Column>
          </Column>
        </Row>
      </Column>
    </Box>
  )
}

export default CoveredProtocolsList
