import React, { useMemo } from "react"
import { utils } from "ethers"
import { DateTime } from "luxon"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Title } from "../../components/Title"
import { Chart } from "../../components/Chart/Chart"

import { useTVCOverTime, useTVLOverTime } from "../../hooks/api/stats"

import styles from "./Overview.module.scss"
import APYChart from "../../components/APYChart/APYChart"
import CoveredProtocolsList from "../../components/CoveredProtocolsList/CoveredProtocolsList"
import { formatAmount } from "../../utils/format"
import StrategiesList from "../../components/StrategiesList/StrategiesList"
import config from "../../config"
import { ExcessCoverageChart } from "./ExcessCoverageChart"
import { Text } from "../../components/Text"

type ChartDataPoint = {
  name: number
  value: number
}

export const OverviewPage: React.FC = () => {
  const { data: tvlData } = useTVLOverTime()
  const { data: tvcData } = useTVCOverTime()

  const chartsData = useMemo(() => {
    if (!tvlData || !tvcData) return

    const tvcChartData: ChartDataPoint[] = []
    const tvlChartData: ChartDataPoint[] = []
    const capitalEfficiencyChartData: ChartDataPoint[] = []

    for (let i = 0, j = 0; i < tvlData.length && j < tvcData.length; ) {
      const tvcDataPointDate = DateTime.fromSeconds(tvcData[i].timestamp)
      const tvlDataPointDate = DateTime.fromSeconds(tvlData[j].timestamp)

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

      const tvcDataPoint = {
        name: timestamp,
        value: Number(utils.formatUnits(tvc.value, 6)),
      }

      const tvlDataPoint = {
        name: timestamp,
        value: Number(utils.formatUnits(tvl.value, 6)),
      }

      // TVC is increased by 25% due to our agreement with Nexus.
      // To calculate capital efficiency, we only used what is being covered by Sherlock's staking pool.
      const sherlockTVC = timestamp > config.nexusMutualStartTimestamp ? tvc.value.mul(75).div(100) : tvc.value

      const capitalEfficiencyDataPoint = {
        name: timestamp,
        value: Number(utils.formatUnits(sherlockTVC, 6)) / Number(utils.formatUnits(tvl.value, 6)),
      }

      if (tvcChartData.length > 0 && tvcChartData[tvcChartData.length - 1].name === timestamp) {
        tvcChartData.pop()
        tvlChartData.pop()
        capitalEfficiencyChartData.pop()
      }

      tvcChartData.push(tvcDataPoint)
      tvlChartData.push(tvlDataPoint)
      capitalEfficiencyChartData.push(capitalEfficiencyDataPoint)
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
                {chartsData?.tvcChartData &&
                  `$ ${formatAmount(chartsData.tvcChartData[chartsData.tvcChartData.length - 1].value, 0)}`}
              </Title>
            </Row>
            <Row alignment="center">
              <Chart
                height={200}
                data={chartsData?.tvcChartData}
                tooltipProps={{
                  formatter: (v: number, name: string) => [`$${formatAmount(v, 0)}`, "TVC"],
                  labelFormatter: (v: number) => DateTime.fromSeconds(v).toLocaleString(DateTime.DATE_MED),
                }}
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
                {chartsData?.tvlChartData &&
                  `$ ${formatAmount(chartsData.tvlChartData[chartsData.tvlChartData.length - 1].value, 0)}`}
              </Title>
            </Row>
            <Row>
              <Chart
                height={200}
                data={chartsData?.tvlChartData}
                tooltipProps={{
                  formatter: (v: number, name: string) => [`$${formatAmount(v, 0)}`, "TVL"],
                  labelFormatter: (v: number) => DateTime.fromSeconds(v).toLocaleString(DateTime.DATE_MED),
                }}
              />
            </Row>
          </Column>
        </Box>
        <Column>
          <ExcessCoverageChart />
        </Column>
      </Row>
      <Row spacing="m">
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
                height={200}
                data={chartsData?.capitalEfficiencyChartData}
                tooltipProps={{
                  formatter: (v: number, name: string) => [v.toFixed(2), "Capital efficiency"],
                  labelFormatter: (v: number) => DateTime.fromSeconds(v).toLocaleString(DateTime.DATE_MED),
                }}
                yTickFormatter={(v) => v.toFixed(2)}
              />
            </Row>
          </Column>
        </Box>
        <Column>
          <APYChart />
        </Column>
      </Row>
      <Row spacing="m">
        <Column grow={1}>
          <CoveredProtocolsList />
        </Column>
      </Row>
      <Row spacing="m">
        <Column grow={1}>
          <StrategiesList />
        </Column>
      </Row>
      <Row spacing="m">
        <Column grow={1} spacing="m">
          <Box shadow={false}>
            <Row grow={1}>
              <Column spacing="l" grow={1}>
                <Title variant="h3">CLAIMS</Title>
                <Title>0</Title>
                <Row alignment={["center", "center"]}>
                  <Text>Sherlock has not experienced any claims or payouts in its history.</Text>
                </Row>
              </Column>
            </Row>
          </Box>
        </Column>
      </Row>
    </Column>
  )
}
