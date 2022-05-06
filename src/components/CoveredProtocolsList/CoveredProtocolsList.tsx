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

  const protocolsData = useMemo(() => {
    if (!coveredProtocolsData || !tvcData) {
      return []
    }

    // Compute each protocol's max claimable amount
    const protocolsWithCoverages =
      Object.entries(coveredProtocolsData)?.map(([key, item]) => {
        const [current, previous] = item.coverages.map((item) => item.coverageAmount)
        const maxClaimableAmount = previous?.gt(current) ? previous : current
        const coverage = item.tvl?.lt(maxClaimableAmount) ? item.tvl : maxClaimableAmount

        const percentageOfTotal = coverage.mul(100).div(tvcData[tvcData.length - 1].value)

        return {
          id: item.bytesIdentifier,
          name: item.name,
          coverage,
          percentageOfTotal,
        }
      }) ?? []

    return protocolsWithCoverages
  }, [coveredProtocolsData, tvcData])

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
              <Column className={styles.listColumn}>
                <Text strong>Coverage</Text>
              </Column>
              <Column className={styles.listColumn}>
                <Text strong>%</Text>
              </Column>
            </Row>
            {protocolsData?.map((item) => (
              <Row key={item.id}>
                <Column className={cx(styles.listColumn, styles.entry)}>
                  <Text strong className={styles.protocolName}>
                    {item.name}
                  </Text>
                </Column>
                <Column className={cx(styles.listColumn, styles.entry)}>
                  <Text>${formatAmount(ethers.utils.formatUnits(item.coverage, 6))}</Text>
                </Column>
                <Column className={cx(styles.listColumn, styles.entry)}>
                  <Text>{item.percentageOfTotal.toString()}%</Text>
                </Column>
              </Row>
            ))}
          </Column>
        </Row>
      </Column>
    </Box>
  )
}

export default CoveredProtocolsList
