import React, { useEffect, useMemo } from "react"
import { utils } from "ethers"
import { DateTime } from "luxon"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Title } from "../../components/Title"
import { Chart } from "../../components/Chart/Chart"

import styles from "./InternalOverview.module.scss"
import { formatAmount } from "../../utils/format"
import { useUnlockOverTime } from "../../hooks/api/useUnlockOverTime"

type ChartDataPoint = {
  name: string
  value: number
}

export const InternalOverviewPage: React.FC = () => {
  const { getUnlockOverTime, data: unlockData } = useUnlockOverTime()

  useEffect(() => {
    getUnlockOverTime()
  }, [getUnlockOverTime])

  const unlockChartData = useMemo(() => {
    if (!unlockData) return

    console.log("Unlock data", unlockData)

    const chartData: ChartDataPoint[] = unlockData?.map((item) => ({
      name: DateTime.fromMillis(item.timestamp * 1000).toLocaleString({
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      value: Number(utils.formatUnits(item.value, 6)),
    }))

    console.log("Chart data", chartData)

    return chartData
  }, [unlockData])

  return (
    <Column spacing="m" className={styles.container}>
      <Row>
        <Box shadow={false} fullWidth>
          <Column spacing="m">
            <Row>
              <Title variant="h3">UNLOCK PERIODS</Title>
            </Row>
            <Row alignment="center">
              <Chart
                width={1000}
                height={200}
                data={unlockChartData}
                tooltipFormatter={(v: number, name: string) => [`$${formatAmount(v, 0)}`, "Active Balance"]}
              />
            </Row>
          </Column>
        </Box>
      </Row>
    </Column>
  )
}
