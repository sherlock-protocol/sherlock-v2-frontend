import { Column, Row } from "../../components/Layout"
import { AddressesSection } from "./AddressesSection"
import { PayoutAddressSection } from "./PayoutAddressSection"
import { ProfileInfoSection } from "./ProfileInfoSection"

import { useProfile } from "../../hooks/api/auditors/useProfile"
import { AccountFrozenBanner } from "./AccountFrozenBanner/AccountFrozenBanner"

export const AuditorProfile = () => {
  const { data: profile } = useProfile()

  if (!profile) return null

  return (
    <Column spacing="xl">
      {profile.frozen && (
        <>
          <AccountFrozenBanner />
          <hr />
        </>
      )}
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
    </Column>
  )
}
