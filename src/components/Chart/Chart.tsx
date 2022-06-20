import React from "react"
import { AreaChart, YAxis, XAxis, Tooltip, TooltipProps, Area, XAxisProps, AreaProps } from "recharts"

import { shortenNumber } from "../../utils/units"

type Props = {
  width?: number
  height?: number
  data?: any[]
  yTickFormatter?: (v: number) => string
  type?: AreaProps["type"]
  xAxisProps?: XAxisProps
  tooltipProps?: TooltipProps<any, any>
}

export const Chart: React.FC<Props> = ({
  width,
  height,
  data,
  yTickFormatter = (v) => (v > 0 ? `$ ${shortenNumber(v)}` : ""),
  type = "monotone",
  xAxisProps,
  tooltipProps,
}) => {
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
        width={80}
        tickFormatter={yTickFormatter}
      />
      <XAxis
        dataKey="name"
        tick={{ fill: "white", fontSize: "12px" }}
        tickMargin={5}
        allowDuplicatedCategory={false}
        {...xAxisProps}
      />
      <Tooltip itemStyle={{ color: "#19032d" }} labelStyle={{ color: "gray" }} {...tooltipProps} />
      <Area type={type} dataKey="value" stroke="#8414EC" fill="url(#tvl)" fillOpacity={1} isAnimationActive={true} />
    </AreaChart>
  )
}
