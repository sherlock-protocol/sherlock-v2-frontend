import { Column, Row } from "../../components/Layout"
import { AddressesSection } from "./AddressesSection"
import { PayoutAddressSection } from "./PayoutAddressSection"
import { ProfileInfoSection } from "./ProfileInfoSection"

import { useProfile } from "../../hooks/api/auditors/useProfile"
import { DebtHistorySection } from "./DebtHistorySection"

export const AuditorProfile = () => {
  const { data: profile } = useProfile()

  if (!profile) return null

  return (
    <Column spacing="xl">
      <Row spacing="xl">
        <ProfileInfoSection />
        <Column spacing="l">
          <Row grow={0}>
            <PayoutAddressSection />
          </Row>
          <Row grow={1}>
            <AddressesSection />
          </Row>
        </Column>
      </Row>
      <Row>
        <DebtHistorySection />
      </Row>
    </Column>
  )
}
