import React from "react"
import { Column, Row } from "../../components//Layout"
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
  label?: string
  detail?: React.ReactElement | string
} & ErrorStateProps

export const Field: React.FC<Props> = ({ label, detail, children, ...props }) => {
  return (
    <Column spacing="xs" grow={1}>
      {label && (
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
      <Row>{children}</Row>
      {detail && (
        <Row>
          <Text size="small">{detail}</Text>
        </Row>
      )}
    </Column>
  )
}
