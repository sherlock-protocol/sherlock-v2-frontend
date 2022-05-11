import React, { useEffect, useMemo } from "react"
import { Box } from "../Box"
import { Column, Row } from "../Layout"
import { Title } from "../Title"
import { useCoveredProtocols } from "../../hooks/api/useCoveredProtocols"
import { Text } from "../Text"
import { formatAmount } from "../../utils/format"
import { ethers } from "ethers"
import styles from "./CoveredProtocolsList.module.scss"
import cx from "classnames"
import { useTVCOverTime } from "../../hooks/api/useTVCOverTime"

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

        const percentageOfTotal = (coverage.div(1e6).toNumber() * 100) / tvc.div(1e6).toNumber()

        return {
          id: item.bytesIdentifier,
          name: item.name,
          coverage,
          percentageOfTotal,
        }
      }) ?? []

    return protocolsWithCoverages
  }, [coveredProtocolsData, tvc])

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
                    <Text strong className={styles.protocolName}>
                      {item.name}
                    </Text>
                  </Column>
                  <Column alignment="end" className={cx(styles.listColumn, styles.entry)}>
                    <Text>${formatAmount(ethers.utils.formatUnits(item.coverage, 6), 0)}</Text>
                  </Column>
                  <Column className={cx(styles.listColumn, styles.entry)} grow={1}></Column>
                  <Column className={cx(styles.listColumn, styles.entry)}>
                    <Text>{item.percentageOfTotal.toFixed(0)}%</Text>
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
