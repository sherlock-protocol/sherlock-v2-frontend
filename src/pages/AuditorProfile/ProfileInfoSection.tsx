import { AuditorForm } from "../../components/AuditorForm/AuditorForm"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { useProfile } from "../../hooks/api/auditors"
import { useUpdateProfile } from "../../hooks/api/auditors/useUpdateProfile"

export const ProfileInfoSection = () => {
  const { data: profile } = useProfile()
  const { update, isLoading, isSuccess } = useUpdateProfile()

  if (!profile) return null

  return (
    <Box shadow={false}>
      <Column spacing="l">
        <Row alignment={["start", "baseline"]} spacing="m">
          <Title variant="h2">Profile</Title>
          {isSuccess && (
            <Text size="small" variant="secondary">
              Updated!
            </Text>
          )}
          {isLoading && (
            <Text size="small" variant="secondary">
              Updating...
            </Text>
          )}
        </Row>
        <AuditorForm initialValues={profile} onSubmit={update} submitLabel="SAVE" disabled={isLoading} />
      </Column>
    </Box>
  )
}
