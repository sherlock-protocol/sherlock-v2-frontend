import React, { useEffect, useMemo } from "react"
import { utils } from "ethers"
import { DateTime } from "luxon"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Title } from "../../components/Title"
import { Chart } from "../../components/Chart/Chart"

import { commify } from "../../utils/units"
import { useTVLOverTime } from "../../hooks/api/useTVLOverTime"
import { useTVCOverTime } from "../../hooks/api/useTVCOverTime"

import styles from "./Overview.module.scss"
import APYChart from "../../components/APYChart/APYChart"

type ChartDataPoint = {
  name: string
  value: number
}

export const OverviewPage: React.FC = () => {
  const { getTVLOverTime, data: tvlData } = useTVLOverTime()
  const { getTVCOverTime, data: tvcData } = useTVCOverTime()

  useEffect(() => {
    getTVLOverTime()
    getTVCOverTime()
  }, [getTVLOverTime, getTVCOverTime])

  const chartsData = useMemo(() => {
    if (!tvlData || !tvcData) return

    const tvcChartData: ChartDataPoint[] = []
    const tvlChartData: ChartDataPoint[] = []
    const capitalEfficiencyChartData: ChartDataPoint[] = []

    for (let i = 0, j = 0; i < tvlData.length && j < tvcData.length; ) {
      const tvcDataPointDate = DateTime.fromMillis(tvcData[i].timestamp * 1000)
      const tvlDataPointDate = DateTime.fromMillis(tvlData[j].timestamp * 1000)

      let tvc = tvcData[i]
      let tvl = tvlData[j]

      if (tvcDataPointDate.day !== tvlDataPointDate.day) {
        if (tvcDataPointDate < tvlDataPointDate) {
          tvl = j > 0 ? tvlData[j - 1] : tvlData[j]
          i++
        } else {
          tvc = i > 0 ? tvcData[i - 1] : tvcData[i]
          j++
        }
      } else {
        i++
        j++
      }

      const timestamp = Math.min(tvc.timestamp, tvl.timestamp)

      tvcChartData.push({
        name: DateTime.fromMillis(timestamp * 1000).toLocaleString({ month: "2-digit", day: "2-digit" }),
        value: Number(utils.formatUnits(tvc.value, 6)),
      })
      tvlChartData.push({
        name: DateTime.fromMillis(timestamp * 1000).toLocaleString({ month: "2-digit", day: "2-digit" }),
        value: Number(utils.formatUnits(tvl.value, 6)),
      })
      capitalEfficiencyChartData.push({
        name: DateTime.fromMillis(timestamp * 1000).toLocaleString({ month: "2-digit", day: "2-digit" }),
        value: Number(utils.formatUnits(tvc.value, 6)) / Number(utils.formatUnits(tvl.value, 6)),
      })
    }

    return {
      tvcChartData,
      tvlChartData,
      capitalEfficiencyChartData,
    }
  }, [tvlData, tvcData])

  return (
    <Column spacing="m" className={styles.container}>
      <Row>
        <Box shadow={false} fullWidth>
          <Column spacing="m">
            <Row>
              <Title variant="h3">TOTAL VALUE COVERED</Title>
            </Row>
            <Row>
              <Title>
                {tvcData &&
                  tvcData.length > 0 &&
                  `$ ${commify(utils.formatUnits(tvcData[tvcData.length - 1].value, 6), 2)}`}
              </Title>
            </Row>
            <Row alignment="center">
              <Chart
                width={1000}
                height={200}
                data={chartsData?.tvcChartData}
                tooltipFormatter={(v: number, name: string) => [`$${commify(v, 2)}`, "TVC"]}
              />
            </Row>
          </Column>
        </Box>
      </Row>
      <Row spacing="m">
        <Box shadow={false}>
          <Column spacing="m">
            <Row>
              <Title variant="h3">STAKING POOL</Title>
            </Row>
            <Row>
              <Title>
                {tvlData &&
                  tvlData.length > 0 &&
                  `$ ${commify(utils.formatUnits(tvlData[tvlData.length - 1].value, 6), 2)}`}
              </Title>
            </Row>
            <Row>
              <Chart
                width={450}
                height={200}
                data={chartsData?.tvlChartData}
                tooltipFormatter={(v: number, name: string) => [`$${commify(v, 2)}`, "TVL"]}
              />
            </Row>
          </Column>
        </Box>
        <Box shadow={false}>
          <Column spacing="m">
            <Row>
              <Title variant="h3">CAPITAL EFFICIENCY</Title>
            </Row>
            <Row>
              <Title>
                {chartsData?.capitalEfficiencyChartData &&
                  chartsData.capitalEfficiencyChartData.length > 0 &&
                  `${chartsData.capitalEfficiencyChartData[
                    chartsData.capitalEfficiencyChartData.length - 1
                  ].value.toFixed(2)}`}
              </Title>
            </Row>
            <Row>
              <Chart
                width={450}
                height={200}
                data={chartsData?.capitalEfficiencyChartData}
                tooltipFormatter={(v: number, name: string) => [v.toFixed(2), "Capital efficiency"]}
                yTickFormatter={(v) => v.toFixed(2)}
              />
            </Row>
          </Column>
        </Box>
      </Row>
      <Row spacing="m">
        <Column>
          <APYChart />
        </Column>
        <Column></Column>
      </Row>
    </Column>
  )
}
