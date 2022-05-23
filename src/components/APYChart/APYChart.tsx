import React, { useEffect, useMemo } from "react"
import { useAPYOverTime } from "../../hooks/api/useAPYOverTime"
import { Box } from "../Box"
import { Chart } from "../Chart/Chart"
import { Column, Row } from "../Layout"
import { Title } from "../Title"
import { DateTime } from "luxon"
import { useStakingPositions } from "../../hooks/api/useStakingPositions"

/**
 * APY over time chart.
 */
const APYChart: React.FC = () => {
  const { getAPYOverTime, data: apyData } = useAPYOverTime()
  const { getStakingPositions, data: stakingPositionsData } = useStakingPositions()

  useEffect(() => {
    getAPYOverTime()
    getStakingPositions()
  }, [getAPYOverTime, getStakingPositions])

  const chartData = useMemo(() => {
    const apyChartData = apyData?.map((item) => ({
      name: DateTime.fromMillis(item.timestamp * 1000).toLocaleString({ month: "2-digit", day: "2-digit" }),
      value: item.value,
    }))

    return apyChartData
  }, [apyData])

  return (
    <Box shadow={false}>
      <Column spacing="m">
        <Row>
          <Title variant="h3">APY</Title>
        </Row>
        <Row>
          <Title>{stakingPositionsData?.usdcAPY?.toFixed(2)}%</Title>
        </Row>
        <Row alignment="center">
          <Chart
            width={450}
            height={200}
            data={chartData}
            tooltipProps={{
              formatter: (v: number, name: string) => [`${v}%`, "APY"],
            }}
            yTickFormatter={(v) => `${v}%`}
          />
        </Row>
      </Column>
    </Box>
  )
}

export default APYChart
