import { Chart } from "../../components/Chart/Chart"
import { DateTime } from "luxon"
import { useTVCOverTime } from "../../hooks/api/stats"
import { useMemo } from "react"
import { utils } from "ethers"

import { formatAmount } from "../../utils/format"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Title } from "../../components/Title"
import config from "../../config"
import { Text } from "../../components/Text"

const tooltipTitles: Record<string, string> = {
  value: "Nexus Mutual",
}

const nexusStartDate = DateTime.fromSeconds(config.nexusMutualStartTimestamp)
console.log(nexusStartDate.toLocaleString())

export const ExcessCoverageChart = () => {
  const { data: tvcData } = useTVCOverTime()

  const chartData = useMemo(
    () =>
      tvcData?.reduce<{ name: string; value: number }[]>((dataPoints, item) => {
        const date = DateTime.fromSeconds(item.timestamp)

        if (nexusStartDate.diff(date, "days").days < 5) {
          dataPoints.push({
            name: date.toLocaleString({ month: "2-digit", day: "2-digit" }),
            value: date > nexusStartDate ? Number(utils.formatUnits(item.value.mul(25).div(100), 6)) : 0,
          })
        }

        return dataPoints
      }, []),
    [tvcData]
  )

  console.log(chartData)

  const totalAmount = useMemo(() => {
    if (!chartData || chartData.length === 0) return null

    return chartData[chartData.length - 1].value
  }, [chartData])

  return (
    <Box shadow={false} fullWidth>
      <Column spacing="m">
        <Row>
          <Title variant="h3">EXTERNAL COVERAGE</Title>
        </Row>

        <Row>
          <Title>{totalAmount && `$${formatAmount(totalAmount, 0)}`}</Title>
        </Row>
        <Row>
          <Chart
            height={200}
            data={chartData}
            tooltipProps={{
              formatter: (v: number, name: string) => [`$${formatAmount(v, 0)}`, tooltipTitles[name]],
            }}
          />
        </Row>
      </Column>
    </Box>
  )
}
