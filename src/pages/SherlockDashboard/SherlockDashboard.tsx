import React, { useEffect } from "react"
import { utils } from "ethers"
import { DateTime } from "luxon"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Title } from "../../components/Title"
import { Text } from "../../components/Text"
import { Chart } from "./Chart"

import { useTVLOverTime } from "../../hooks/api/useTVLOverTime"

import styles from "./SherlockDashboardPage.module.scss"

export const SherlockDashboardPage: React.FC = () => {
  const { getTVLOverTime, data: tvlData, loading, error } = useTVLOverTime()

  useEffect(() => {
    const loadData = async () => {
      await getTVLOverTime()
    }
    loadData()
  }, [getTVLOverTime])

  const chartData = tvlData?.map((d) => ({
    name: DateTime.fromMillis(d.timestamp * 1000).toFormat("M/d"),
    tvl: Number(utils.formatUnits(d.value, 6)),
  }))

  return (
    <Column spacing="m">
      <Row>
        <Box shadow={false} fullWidth>
          <Column spacing="m">
            <Row>
              <Title variant="h3">STAKING POOL</Title>
            </Row>
            <Row>
              <Title>
                {tvlData &&
                  tvlData.length > 0 &&
                  `$ ${utils.commify(utils.formatUnits(tvlData[tvlData.length - 1].value, 6))}`}
              </Title>
            </Row>
            <Row alignment="center">
              <Chart width={900} height={200} data={chartData} />
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
                  `$ ${utils.commify(utils.formatUnits(tvlData[tvlData.length - 1].value, 6))}`}
              </Title>
            </Row>
            <Row>
              <Chart width={450} height={200} data={chartData} />
            </Row>
          </Column>
        </Box>
        <Box shadow={false}>
          <Column spacing="m">
            <Row>
              <Title variant="h3">STAKING POOL</Title>
            </Row>
            <Row>
              <Title>
                {tvlData &&
                  tvlData.length > 0 &&
                  `$ ${utils.commify(utils.formatUnits(tvlData[tvlData.length - 1].value, 6))}`}
              </Title>
            </Row>
            <Row>
              <Chart width={450} height={200} data={chartData} />
            </Row>
          </Column>
        </Box>
      </Row>
    </Column>
  )
}
