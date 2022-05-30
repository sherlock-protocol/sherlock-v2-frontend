import React from "react"
import { Column, Row } from "../../components//Layout"
import { Text } from "../../components//Text"

type Props = {
  label?: string
}

export const Field: React.FC<Props> = ({ label, children }) => {
  return (
    <Column spacing="xs" grow={1}>
      {label && (
        <Row>
          <Text size="small" strong>
            {label}
          </Text>
        </Row>
      )}
      <Row>{children}</Row>
    </Column>
  )
}
