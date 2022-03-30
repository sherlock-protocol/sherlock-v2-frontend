import React, { useEffect } from "react"
import { utils } from "ethers"
import { AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts"
import { DateTime } from "luxon"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Title } from "../../components/Title"
import { Text } from "../../components/Text"

import { shortenNumber } from "../../utils/units"

import { useTVLOverTime } from "../../hooks/api/useTVLOverTime"

import styles from "./SherlockDashboardPage.module.scss"

function renderCustomAxisTick() {
  return <Text>hello</Text>
}

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
    <Box>
      <Column spacing="m">
        <Row>
          <Title variant="h3">STAKING POOL</Title>
        </Row>
        <Row>
          <Title>$22,056,005.00</Title>
        </Row>
        <Row>
          {chartData && (
            <AreaChart width={800} height={200} data={chartData}>
              <defs>
                <linearGradient id="tvl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8414eC" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#8414eC" stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis
                width={80}
                orientation="right"
                tick={{ fill: "white", fontSize: "12px" }}
                tickMargin={5}
                tickFormatter={(v) => (v > 0 ? `$ ${shortenNumber(v)}` : "")}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "white", fontSize: "12px" }}
                tickMargin={5}
                allowDuplicatedCategory={false}
              />
              <Tooltip
                formatter={(v: number, name: string) => [`$${utils.commify(v)}`, name.toUpperCase()]}
                itemStyle={{ color: "#19032d" }}
                labelStyle={{ color: "gray" }}
              />
              <Area type="monotone" dataKey="tvl" stroke="#8414EC" fill="url(#tvl)" fillOpacity={1} />
            </AreaChart>
          )}
        </Row>
      </Column>
    </Box>
  )
}
