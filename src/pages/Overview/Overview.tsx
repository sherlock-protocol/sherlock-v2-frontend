import React, { useMemo } from "react"
import { utils } from "ethers"
import { DateTime } from "luxon"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Title } from "../../components/Title"
import { Chart } from "../../components/Chart/Chart"

import { useTVCOverTime, useTVLOverTime, useExternalCoverageOverTime } from "../../hooks/api/stats"

import styles from "./Overview.module.scss"
import APYChart from "../../components/APYChart/APYChart"
import CoveredProtocolsList from "../../components/CoveredProtocolsList/CoveredProtocolsList"
import { formatAmount } from "../../utils/format"
import StrategiesList from "../../components/StrategiesList/StrategiesList"
import { ExcessCoverageChart } from "./ExcessCoverageChart"
import ClaimsList from "../../components/ClaimsList/ClaimsList"

type ChartDataPoint = {
  name: number
  value: number
}

export const OverviewPage: React.FC = () => {
  const { data: tvlData } = useTVLOverTime()
  const { data: tvcData } = useTVCOverTime()
  const { data: externalCoverageData } = useExternalCoverageOverTime()

  const chartsData = useMemo(() => {
    if (!tvlData || !tvcData || !externalCoverageData) return

    const tvcChartData: ChartDataPoint[] = []
    const tvlChartData: ChartDataPoint[] = []
    const capitalEfficiencyChartData: ChartDataPoint[] = []

    for (let i = 0; i < tvcData.length; i++) {
      const tvc = tvcData[i]
      const tvl = tvlData[i]
      const externalCoverage = externalCoverageData[i]

      const timestamp = Math.min(tvc.timestamp, tvl.timestamp)

      const tvcDataPoint = {
        name: timestamp,
        value: Number(utils.formatUnits(tvc.value, 6)),
      }

      const tvlDataPoint = {
        name: timestamp,
        value: Number(utils.formatUnits(tvl.value, 6)),
      }

      // External coverage is subtracted from the total TVC due to our agreement with Nexus
      // and only a part of the TVC is covereged by Sherlock's staking pool.
      // const sherlockTVC = timestamp > config.nexusMutualStartTimestamp ? tvc.value.mul(75).div(100) : tvc.value
      const sherlockTVC = tvc.value.sub(externalCoverage.value)

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

      if (capitalEfficiencyDataPoint.value > 0) {
        capitalEfficiencyChartData.push(capitalEfficiencyDataPoint)
      }
    }

    return {
      tvcChartData,
      tvlChartData,
      capitalEfficiencyChartData,
    }
  }, [tvlData, tvcData, externalCoverageData])

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
        <Column grow={1}>
          <ClaimsList />
        </Column>
      </Row>
    </Column>
  )
}
