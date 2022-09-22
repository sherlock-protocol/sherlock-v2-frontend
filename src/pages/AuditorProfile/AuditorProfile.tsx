import React, { useEffect, useState } from "react"
import { FaTrash, FaPlusSquare } from "react-icons/fa"
import { AuditorForm } from "../../components/AuditorForm/AuditorForm"

import { Box } from "../../components/Box"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { Column, Row } from "../../components/Layout"
import { Table, TBody, Td, Tr } from "../../components/Table/Table"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { useProfile } from "../../hooks/api/auditors"
import { Field } from "../Claim/Field"
import { AddressesSection } from "./AddressesSection"

import styles from "./AuditorProfile.module.scss"
import { PayoutAddressSection } from "./PayoutAddressSection"
import { ProfileInfoSection } from "./ProfileInfoSection"

export const AuditorProfile = () => {
  const { data: profile } = useProfile()

  if (!profile) return null

  return (
    <Row spacing="xl">
      <ProfileInfoSection />
      <Column spacing="l">
        <PayoutAddressSection />
        <AddressesSection />
      </Column>
    </Row>
  )
}
