import React from "react"
import { TooltipProps } from "recharts"
import { GoPrimitiveDot } from "react-icons/go"
import { Column, Row } from "../Layout"
import { Text } from "../Text"

import styles from "./Tooltip.module.scss"

export const Tooltip: React.FC<TooltipProps<number, string>> = ({ label, payload, formatter, labelFormatter }) => {
  let finalLabel = label
  if (!!label && labelFormatter && payload !== undefined && payload !== null) {
    finalLabel = labelFormatter(label, payload)
  }

  return (
    <div className={styles.tooltip}>
      <Column spacing="s">
        <Row>
          <Text strong size="tiny">
            {finalLabel}
          </Text>
        </Row>
        {payload?.map((p, index) => {
          const [value, name] = formatter ? formatter(p.value, p.name) : [p.value, p.name]
          return (
            <Row alignment={"space-between"} spacing="m" key={`tooltip-${index}`}>
              <Column>
                <Row>
                  <GoPrimitiveDot color={p.color} />
                  <Text>{name}</Text>
                </Row>
              </Column>
              <Column>{value}</Column>
            </Row>
          )
        })}
      </Column>
    </div>
  )
}
