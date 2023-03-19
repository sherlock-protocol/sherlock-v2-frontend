import { Column, Row } from "../../components/Layout"
import { AddressesSection } from "./AddressesSection"
import { PayoutAddressSection } from "./PayoutAddressSection"
import { ProfileInfoSection } from "./ProfileInfoSection"

import { useProfile } from "../../hooks/api/auditors/useProfile"
import { Box } from "../../components/Box"
import { Title } from "../../components/Title"
import { Text } from "../../components/Text"
import { Button } from "../../components/Button"
import { commify } from "../../utils/units"
import { AccountFrozenBanner } from "./AccountFrozenBanner/AccountFrozenBanner"

export const AuditorProfile = () => {
  const { data: profile } = useProfile()

  if (!profile) return null

  return (
    <Column spacing="xl">
      {profile.frozen && <AccountFrozenBanner />}
      <Row spacing="xl">
        <ProfileInfoSection disabled={profile.frozen} />
        <Column spacing="l">
          <Row grow={0}>
            <PayoutAddressSection disabled={profile.frozen} />
          </Row>
          <Row grow={1}>
            <AddressesSection disabled={profile.frozen} />
          </Row>
        </Column>
      </Row>
    </Column>
  )
}
