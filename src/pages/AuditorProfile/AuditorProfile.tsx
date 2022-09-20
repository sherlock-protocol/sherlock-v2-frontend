import React, { useEffect, useState } from "react"
import { FaTrash, FaPlusSquare, FaEdit } from "react-icons/fa"

import { Box } from "../../components/Box"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { Column, Row } from "../../components/Layout"
import { Table, TBody, Td, Tr } from "../../components/Table/Table"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { useProfile } from "../../hooks/api/auditors"
import { Field } from "../Claim/Field"

import styles from "./AuditorProfile.module.scss"
import { PayoutAddressSection } from "./PayoutAddressSection"

export const AuditorProfile = () => {
  const { data: profile } = useProfile()

  const [payoutAddress, setPayoutAddress] = useState<string>(profile?.payoutAddress ?? "")

  /**
   * Update input fields whenever the profile changes.
   */
  useEffect(() => {
    setPayoutAddress(profile?.payoutAddress ?? "")
  }, [profile])

  if (!profile) return null

  return (
    <Row spacing="xl">
      <Box shadow={false}>
        <Column spacing="l">
          <Title variant="h2">Profile</Title>

          <Field label="HANDLE">
            <Input value={profile.handle} disabled />
          </Field>
          <Field label="GITHUB">
            <Input value={profile.githubHandle} disabled />
          </Field>
          <Field label="DISCORD">
            <Input value={profile.discordHandle} disabled />
          </Field>
          <Field label="TELEGRAM">
            <Input value={profile.telegramHandle} disabled />
          </Field>
          <Field label="TWITTER">
            <Input value={profile.twitterHandle} disabled />
          </Field>
        </Column>
      </Box>
      <Column spacing="l">
        <PayoutAddressSection />
        <Box shadow={false}>
          <Title variant="h2">Addresses</Title>
          <Table selectable={false}>
            <TBody>
              {profile.addresses.map((address) => (
                <Tr>
                  <Td>
                    <Text variant="mono">{address.address}</Text>
                  </Td>
                  <Td>
                    <Button size="small" variant="secondary">
                      <FaTrash />
                    </Button>
                  </Td>
                </Tr>
              ))}
              <Tr>
                <Td>
                  <Input variant="secondary" placeholder="Add new address ..." />
                </Td>
                <Td>
                  <Button size="small" variant="secondary">
                    <FaPlusSquare />
                  </Button>
                </Td>
              </Tr>
            </TBody>
          </Table>
        </Box>
      </Column>
    </Row>
  )
}
