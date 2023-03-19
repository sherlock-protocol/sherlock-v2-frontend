import { useCallback } from "react"
import { AuditorForm } from "../../components/AuditorForm/AuditorForm"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { useProfile } from "../../hooks/api/auditors/useProfile"
import { useUpdateProfile } from "../../hooks/api/auditors/useUpdateProfile"
import { ErrorModal } from "../ContestDetails/ErrorModal"

type Props = {
  disabled?: boolean
}

export const ProfileInfoSection: React.FC<Props> = ({ disabled }) => {
  const { data: profile } = useProfile()
  const { update, isLoading, isSuccess, isError, error, reset } = useUpdateProfile()

  const handleErrorModalClose = useCallback(() => {
    reset()
  }, [reset])

  if (!profile) return null

  return (
    <Box shadow={false} disabled={disabled}>
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
        <AuditorForm
          initialValues={profile}
          onSubmit={update}
          submitLabel="SAVE"
          disabled={isLoading}
          disabledFields={["handle"]}
        />
      </Column>
      {isError && <ErrorModal reason={error.fieldErrors ?? error.message} onClose={handleErrorModalClose} />}
    </Box>
  )
}
