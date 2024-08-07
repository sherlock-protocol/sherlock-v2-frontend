import { Chart } from "../../components/Chart/Chart"
import { DateTime } from "luxon"
import { useExternalCoverageOverTime } from "../../hooks/api/stats"
import { useMemo } from "react"
import { utils } from "ethers"

import { formatAmount } from "../../utils/format"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Title } from "../../components/Title"
import config from "../../config"

const tooltipTitles: Record<string, string> = {
  value: "Nexus Mutual",
}

const nexusStartDate = DateTime.fromSeconds(config.nexusMutualStartTimestamp)

export const ExcessCoverageChart = () => {
  const { data: externalCoverageData } = useExternalCoverageOverTime()

  const chartData = useMemo(
    () =>
      externalCoverageData?.reduce<{ name: number; value: number }[]>((dataPoints, item) => {
        const date = DateTime.fromSeconds(item.timestamp)

        if (nexusStartDate.diff(date, "days").days < 5) {
          if (dataPoints.length > 0 && dataPoints[dataPoints.length - 1].name === item.timestamp) {
            dataPoints.pop()
          }

          dataPoints.push({
            name: item.timestamp,
            value: Number(utils.formatUnits(item.value, 6)),
          })
        }

        return dataPoints
      }, []),
    [externalCoverageData]
  )

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
              labelFormatter: (v: number) => DateTime.fromSeconds(v).toLocaleString(DateTime.DATE_MED),
              formatter: (v: number, name: string) => [`$${formatAmount(v, 0)}`, tooltipTitles[name]],
            }}
          />
        </Row>
      </Column>
    </Box>
  )
}
