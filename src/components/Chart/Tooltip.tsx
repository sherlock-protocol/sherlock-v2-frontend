import React, { useCallback } from "react"
import { TooltipProps } from "recharts"
import { GoPrimitiveDot } from "react-icons/go"
import { Column, Row } from "../Layout"
import { Text } from "../Text"

import styles from "./Tooltip.module.scss"

type Props = TooltipProps<number, string> & {
  totalLabel?: string
}

export const Tooltip: React.FC<Props> = ({ label, payload, formatter, labelFormatter, totalLabel }) => {
  let finalLabel = label
  if (!!label && labelFormatter && payload !== undefined && payload !== null) {
    finalLabel = labelFormatter(label, payload)
  }

  const renderTotalRow = useCallback(() => {
    if (!payload) return null
    if (payload.length < 2) return null

    const total = payload.reduce((t, p) => (t += p.value ?? 0), 0)
    const [value, name] = formatter ? formatter(total, "totalValue") : [total, "Total"]

    return (
      <Row alignment={"space-between"} spacing="m" key="tooltip-total">
        <Column>
          <Row>
            <Text>{name}</Text>
          </Row>
        </Column>
        <Column>
          <Text variant="mono">{value}</Text>
        </Column>
      </Row>
    )
  }, [formatter, payload])

  return (
    <div className={styles.tooltip}>
      <Column spacing="s">
        <Row>
          <Text strong size="tiny">
            {finalLabel}
          </Text>
        </Row>
        {renderTotalRow()}
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
              <Column>
                <Text variant="mono">{value}</Text>
              </Column>
            </Row>
          )
        })}
      </Column>
    </div>
  )
}
