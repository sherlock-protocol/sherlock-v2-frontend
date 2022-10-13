import { Chart } from "../../components/Chart/Chart"
import { DateTime } from "luxon"
import { useTVLOverTime } from "../../hooks/api/stats"
import { useMemo } from "react"
import { utils } from "ethers"

import { formatAmount } from "../../utils/format"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Title } from "../../components/Title"

const tooltipTitles: Record<string, string> = {
  nexus: "Nexus Mutual",
  stakingPool: "Staking Pool",
  totalValue: "Total Capital",
}

export const CapitalChart = () => {
  const { data: tvlData } = useTVLOverTime()

  const chartData = useMemo(
    () =>
      tvlData?.map((item) => {
        const date = DateTime.fromSeconds(item.timestamp)

        return {
          name: date.toLocaleString({ month: "2-digit", day: "2-digit" }),
          stakingPool: Number(utils.formatUnits(item.value, 6)),
          nexus: Number(utils.formatUnits(item.value.mul(25).div(75), 6)),
        }
      }),
    [tvlData]
  )

  const totalCapital = useMemo(() => {
    if (!chartData) return null

    const { stakingPool, nexus } = chartData[chartData.length - 1]

    return stakingPool + nexus
  }, [chartData])

  return (
    <Box shadow={false} fullWidth>
      <Column spacing="m">
        <Row>
          <Title variant="h3">CAPITAL POOL</Title>
        </Row>
        <Row>
          <Title>{totalCapital && `$${formatAmount(totalCapital, 0)}`}</Title>
        </Row>
        <Row>
          <Chart
            height={200}
            data={chartData}
            dataKeys={["stakingPool", "nexus"]}
            tooltipProps={{
              formatter: (v: number, name: string) => [`$${formatAmount(v, 0)}`, tooltipTitles[name]],
            }}
          />
        </Row>
      </Column>
    </Box>
  )
}

/**
 *
 * 75 ___ TVL
 * 25 ___ x
 *
 * x = (25*TVL)/75
 *
 *
 */
