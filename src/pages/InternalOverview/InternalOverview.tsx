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
  name: number
  value: number
}

export const InternalOverviewPage: React.FC = () => {
  const { getUnlockOverTime, data: unlockData } = useUnlockOverTime()

  useEffect(() => {
    getUnlockOverTime()
  }, [getUnlockOverTime])

  const unlockChartData = useMemo(() => {
    if (!unlockData) return

    const chartData: ChartDataPoint[] = unlockData?.map((item) => ({
      name: item.timestamp * 1000,
      value: Number(utils.formatUnits(item.value, 6)),
    }))

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
                tooltipProps={{
                  formatter: (v: number, name: string) => [`$${formatAmount(v, 0)}`, "Active Balance"],
                  labelFormatter: (l: number, payload) =>
                    DateTime.fromMillis(l).toLocaleString({
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }),
                }}
                xAxisProps={{
                  type: "number",
                  scale: "time",
                  domain: ["dataMin", "dataMax"],
                  tickFormatter: (v: number) =>
                    DateTime.fromMillis(v).toLocaleString({
                      year: "2-digit",
                      month: "2-digit",
                      day: "2-digit",
                    }),
                  interval: "preserveStartEnd",
                }}
                type="stepAfter"
              />
            </Row>
          </Column>
        </Box>
      </Row>
    </Column>
  )
}
