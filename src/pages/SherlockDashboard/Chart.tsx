import React from "react"
import { AreaChart, YAxis, XAxis, Tooltip, Area } from "recharts"
import { utils } from "ethers"

import { shortenNumber } from "../../utils/units"

type Props = {
  width?: number
  height?: number
  data?: any[]
}

export const Chart: React.FC<Props> = ({ width, height, data }) => {
  return (
    <AreaChart width={width} height={height} data={data}>
      <defs>
        <linearGradient id="tvl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8414eC" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#8414eC" stopOpacity={0} />
        </linearGradient>
      </defs>
      <YAxis
        orientation="right"
        tick={{ fill: "white", fontSize: "12px" }}
        tickMargin={5}
        tickFormatter={(v) => (v > 0 ? `$ ${shortenNumber(v)}` : "")}
      />
      <XAxis dataKey="name" tick={{ fill: "white", fontSize: "12px" }} tickMargin={5} allowDuplicatedCategory={false} />
      <Tooltip
        formatter={(v: number, name: string) => [`$${utils.commify(v)}`, name.toUpperCase()]}
        itemStyle={{ color: "#19032d" }}
        labelStyle={{ color: "gray" }}
      />
      <Area type="monotone" dataKey="tvl" stroke="#8414EC" fill="url(#tvl)" fillOpacity={1} isAnimationActive={true} />
    </AreaChart>
  )
}
