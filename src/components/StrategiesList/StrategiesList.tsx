import React, { useMemo } from "react"
import { Box } from "../Box"
import { Column, Row } from "../Layout"
import { Title } from "../Title"
import { Text } from "../Text"
import { formatAmount } from "../../utils/format"
import { BigNumber, ethers } from "ethers"
import styles from "./StrategiesList.module.scss"
import cx from "classnames"
import { useTVLOverTime } from "../../hooks/api/stats"
import { useStrategies } from "../../hooks/api/strategies"

/**
 * List of strategies
 */
const StrategiesList: React.FC = () => {
  const { data: strategies } = useStrategies()
  const { data: tvlData } = useTVLOverTime()

  // Total Value Locked
  const tvl = useMemo(() => {
    if (tvlData) {
      return tvlData?.length > 0 ? tvlData[tvlData.length - 1].value : undefined
    }
  }, [tvlData])

  const strategiesData = useMemo(() => {
    if (!strategies || !tvl) {
      return []
    }

    // Compute uninvested funds
    const totalInvestedFunds = strategies
      .map((item) => item.value)
      .reduce((prev, cur) => prev.add(cur), BigNumber.from(0))
    const totalUninvestedFunds = tvl.sub(totalInvestedFunds)

    // Compute each strategies's percentage of total TVL
    const strats =
      [...strategies, { address: "0x0", name: "Uninvested funds", value: totalUninvestedFunds }].map((item) => {
        const percentageOfTotal = +((item.value.div(1e6).toNumber() * 100) / tvl.div(1e6).toNumber()).toFixed(0)

        return {
          ...item,
          percentageOfTotal,
        }
      }) ?? []

    // Sort protocols descending
    const sortedStrategies = strats.sort((a, b) => b.percentageOfTotal - a.percentageOfTotal)

    // Fix rounding errors so percentages add up to 100%
    const totalPercentages = sortedStrategies.reduce((value, item) => item.percentageOfTotal + value, 0)
    if (totalPercentages !== 100) {
      const delta = totalPercentages - 100
      sortedStrategies[sortedStrategies.length - 1].percentageOfTotal -= delta
    }

    return sortedStrategies
  }, [strategies, tvl])

  return (
    <Box shadow={false} fullWidth>
      <Column spacing="m">
        <Row>
          <Title variant="h3">STRATEGIES</Title>
        </Row>
        <Row>
          <Title>{strategies?.length}</Title>
        </Row>
        <Row alignment="center">
          <Column grow={1} spacing="xs">
            <Row className={styles.header}>
              <Column className={styles.listColumn}>
                <Text strong>Strategy</Text>
              </Column>
              <Column alignment="end" className={styles.listColumn}>
                <Text strong>Amount</Text>
              </Column>
              <Column className={styles.listColumn} grow={1}></Column>
              <Column className={styles.listColumn}>
                <Text strong>% of TVL</Text>
              </Column>
            </Row>
            <Column grow={1} spacing="xs" className={styles.listContainer}>
              {strategiesData?.map((item) => (
                <Row key={item.address}>
                  <Column className={cx(styles.listColumn, styles.entry)}>
                    <Text strong className={styles.protocolName}>
                      {item.name}
                    </Text>
                  </Column>
                  <Column alignment="end" className={cx(styles.listColumn, styles.entry)}>
                    <Text>${formatAmount(ethers.utils.formatUnits(item.value, 6), 0)}</Text>
                  </Column>
                  <Column className={cx(styles.listColumn, styles.entry)} grow={1}></Column>
                  <Column className={cx(styles.listColumn, styles.entry)}>
                    <Text>{item.percentageOfTotal.toFixed(0)}%</Text>
                  </Column>
                </Row>
              ))}
              {/* {tvl && (
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
              )} */}
            </Column>
          </Column>
        </Row>
      </Column>
    </Box>
  )
}

export default StrategiesList
