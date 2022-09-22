import { Column, Row } from "../../components/Layout"
import { AddressesSection } from "./AddressesSection"
import { PayoutAddressSection } from "./PayoutAddressSection"
import { ProfileInfoSection } from "./ProfileInfoSection"

import { useProfile } from "../../hooks/api/auditors"

export const AuditorProfile = () => {
  const { data: profile } = useProfile()

  if (!profile) return null

  return (
    <Row spacing="xl">
      <ProfileInfoSection />
      <Column spacing="l">
        <Row grow={1}>
          <PayoutAddressSection />
        </Row>
        <Row grow={1}>
          <AddressesSection />
        </Row>
      </Column>
    </Row>
  )
}
