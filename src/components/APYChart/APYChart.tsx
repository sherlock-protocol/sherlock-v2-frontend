import React, { useMemo } from "react"
import { useAPYOverTime } from "../../hooks/api/stats"
import { Box } from "../Box"
import { Chart } from "../Chart/Chart"
import { Column, Row } from "../Layout"
import { Title } from "../Title"
import { DateTime } from "luxon"

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
    const apyChartData = apyData?.map((item) => {
      const date = DateTime.fromMillis(item.timestamp * 1000)

      return {
        name: date.toLocaleString({ month: "2-digit", day: "2-digit" }),
        strategiesAPY: item.totalAPY - item.premiumsAPY - item.incentivesAPY,
        premiumsAPY: item.premiumsAPY,
        incentivesAPY: item.incentivesAPY,
        totalAPY: item.totalAPY,
      }
    })

    return apyChartData
  }, [apyData])

  return (
    <Box shadow={false}>
      <Column spacing="m">
        <Row>
          <Title variant="h3">APY</Title>
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
