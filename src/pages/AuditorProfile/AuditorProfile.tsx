import React, { useEffect } from "react"
import { Box } from "../../components/Box"
import { Input } from "../../components/Input"
import { Column, Row } from "../../components/Layout"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { useAuthentication } from "../../hooks/api/useAuthentication"
import { Field } from "../Claim/Field"

export const AuditorProfile = () => {
  const { auditor } = useAuthentication()

  if (!auditor) return null

  return (
    <Row spacing="xl">
      <Box shadow={false}>
        <Column spacing="l">
          <Title>PROFILE</Title>

          <Field label="HANDLE">
            <Input value={auditor.handle} disabled />
          </Field>
          <Field label="GITHUB">
            <Input value={auditor.githubHandle} disabled />
          </Field>
          <Field label="DISCORD">
            <Input value={auditor.discordHandle} disabled />
          </Field>
          <Field label="TELEGRAM">
            <Input value={auditor.telegramHandle} disabled />
          </Field>
          <Field label="TWITTER">
            <Input value={auditor.twitterHandle} disabled />
          </Field>
        </Column>
      </Box>
      <Box shadow={false}>
        <Title>Addresses</Title>
      </Box>
    </Row>
  )
}
