import React, { PropsWithChildren } from "react"
import { Column, Row } from "../../components/Layout"
import { Text } from "../../components//Text"

type ErrorStateProps =
  | {
      error: true
      errorMessage: string
    }
  | {
      error?: false
    }

type Props = {
  label?: React.ReactElement | string
  detail?: React.ReactElement | string
  sublabel?: React.ReactElement | string
} & ErrorStateProps

export const Field: React.FC<PropsWithChildren<Props>> = ({ label, detail, children, sublabel, ...props }) => {
  return (
    <Column spacing="xs" grow={1} alignment={["stretch", "stretch"]}>
      {(label || props.error) && (
        <Row spacing="xs">
          <Column>
            <Text size="small" variant={props.error ? "warning" : "normal"} strong>
              {label}
            </Text>
          </Column>
          {props.error && (
            <Column>
              <Text size="small" variant="warning">
                {props.errorMessage}
              </Text>
            </Column>
          )}
        </Row>
      )}
      {sublabel && (
        <Row spacing="xs">
          <Text size="small" variant="secondary" strong>
            {sublabel}
          </Text>
        </Row>
      )}
      <Row alignment={["stretch", "stretch"]} grow={1}>
        {children}
      </Row>
      {detail && (
        <Row>
          <Text size="small">{detail}</Text>
        </Row>
      )}
    </Column>
  )
}
