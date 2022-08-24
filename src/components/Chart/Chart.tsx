import React from "react"
import {
  AreaChart,
  YAxis,
  XAxis,
  Tooltip,
  TooltipProps,
  Area,
  XAxisProps,
  AreaProps,
  ResponsiveContainer,
} from "recharts"
import { Tooltip as CustomTooltip } from "./Tooltip"

import { shortenNumber } from "../../utils/units"

const STROKES = ["#8716e8", "#fe6e99", ""]

type Props = {
  height?: number
  data?: any[]
  dataKeys?: string[]
  yTickFormatter?: (v: number) => string
  type?: AreaProps["type"]
  xAxisProps?: XAxisProps
  tooltipProps?: TooltipProps<any, any>
  totalLabel?: string
}

export const Chart: React.FC<Props> = ({
  height,
  data = [],
  dataKeys = ["value"],
  yTickFormatter = (v) => (v > 0 ? `$ ${shortenNumber(v)}` : ""),
  type = "monotone",
  xAxisProps,
  tooltipProps,
  totalLabel,
}) => {
  // Render a placeholder if no data is provided
  // TODO: Render a Skeleton component after adding Chakra
  if (!data || !data.length) {
    return <div style={{ height }} />
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart height={height} data={data}>
        <defs>
          <linearGradient id="1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8716e8" stopOpacity={1} />
            <stop offset="100%" stopColor="#8716e8" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fe6e99" stopOpacity={1} />
            <stop offset="100%" stopColor="#fe6e99" stopOpacity={0.3} />
          </linearGradient>
          <linearGradient id="3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00FEB3" stopOpacity={1} />
            <stop offset="100%" stopColor="#00FEB3" stopOpacity={0.3} />
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
        <Tooltip {...tooltipProps} content={<CustomTooltip />} />
        {dataKeys.map((k, index) => (
          <Area
            key={index}
            stackId={1}
            type={type}
            dataKey={k}
            stroke={STROKES[index]}
            fill={`url(#${index + 1})`}
            fillOpacity={1}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}
