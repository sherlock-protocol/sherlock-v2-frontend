import React, { useMemo } from "react"
import { useAPYOverTime } from "../../hooks/api/stats"
import { Box } from "../Box"
import { Chart } from "../Chart/Chart"
import { Column, Row } from "../Layout"
import { Title } from "../Title"
import { DateTime } from "luxon"

type DataPoint = {
  name: number
  premiumsAPY: number
  strategiesAPY: number
  incentivesAPY: number
  totalAPY: number
}

const tooltipTitles: Record<string, string> = {
  premiumsAPY: "Premiums APY",
  strategiesAPY: "Strategies APY",
  totalValue: "Total APY",
  incentivesAPY: "Incentives APY",
}

/**
 * APY over time chart.
 */
const APYChart: React.FC = () => {
  const { data: apyData } = useAPYOverTime()

  const chartData = useMemo(() => {
    const apyChartData = apyData?.reduce<DataPoint[]>((dataPoints, item) => {
      if (dataPoints.length > 0 && dataPoints[dataPoints.length - 1].name === item.timestamp) {
        dataPoints.pop()
      }

      const strategiesAPY = item.totalAPY - item.premiumsAPY - item.incentivesAPY

      dataPoints.push({
        name: item.timestamp,
        strategiesAPY: Math.max(0, strategiesAPY),
        premiumsAPY: item.premiumsAPY,
        incentivesAPY: item.incentivesAPY,
        totalAPY: item.totalAPY,
      })

      return dataPoints
    }, [])

    return apyChartData
  }, [apyData])

  return (
    <Box shadow={false}>
      <Column spacing="m">
        <Row>
          <Title variant="h3">USDC APY</Title>
        </Row>
        <Row>
          <Title>{chartData?.at(chartData.length - 1)?.totalAPY}%</Title>
        </Row>
        <Row alignment="center">
          <Chart
            height={200}
            data={chartData}
            dataKeys={["premiumsAPY", "strategiesAPY", "incentivesAPY"]}
            tooltipProps={{
              labelFormatter: (v: number) => DateTime.fromSeconds(v).toLocaleString(DateTime.DATE_MED),
              formatter: (v: number, name: string) => [`${v.toFixed(2)}%`, tooltipTitles[name]],
            }}
            yTickFormatter={(v) => `${v}%`}
          />
        </Row>
      </Column>
    </Box>
  )
}

export default APYChart
