import { useCallback, useEffect, useState } from "react"
import { Button } from "../../../components/Button"
import { Column, Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import Modal, { Props as ModalProps } from "../../../components/Modal/Modal"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { ErrorModal } from "../../../pages/ContestDetails/ErrorModal"
import { ContestValues, CreateContestForm } from "./CreateContestForm"
import { ContestsListItem } from "../../../hooks/api/admin/useAdminContests"
import { useAdminUpdateContest } from "../../../hooks/api/admin/useAdminUpdateContest"

type Props = ModalProps & {
  contest: ContestsListItem
}

export const UpdateContestModal: React.FC<Props> = ({ onClose, contest }) => {
  const [formIsDirty, setFormIsDirty] = useState(false)
  const { updateContest, isLoading, isSuccess, error, reset } = useAdminUpdateContest()

  const [displayModalCloseConfirm, setDisplayModalFormConfirm] = useState(false)

  useEffect(() => {
    if (isSuccess) onClose?.()
  }, [isSuccess, onClose])

  const handleModalClose = useCallback(() => {
    if (formIsDirty) {
      setDisplayModalFormConfirm(true)
    } else {
      onClose && onClose()
    }
  }, [setDisplayModalFormConfirm, onClose, formIsDirty])

  const handleModalCloseConfirm = useCallback(() => {
    onClose && onClose()
  }, [onClose])

  const handleModalCloseCancel = useCallback(() => {
    setDisplayModalFormConfirm(false)
  }, [])

  const handleFormSubmit = useCallback(
    (values: ContestValues) => {
      updateContest({
        id: contest.id,
        ...values.contest,
      })
    },
    [contest.id, updateContest]
  )

  return (
    <Modal closeable onClose={handleModalClose}>
      {displayModalCloseConfirm && (
        <Modal>
          <Column spacing="xl">
            <Title>Unsaved contest</Title>
            <Text>
              Are you sure you want to close this form? All unsaved changes will be lost and you will need to start
              over.
            </Text>
            <Row spacing="m" alignment="end">
              <Button variant="secondary" onClick={handleModalCloseCancel}>
                No, continue.
              </Button>
              <Button onClick={handleModalCloseConfirm}>Yes, close.</Button>
            </Row>
          </Column>
        </Modal>
      )}
      <LoadingContainer loading={isLoading} label={`Saving changes ...`}>
        <Column spacing="xl">
          <Title>Edit {contest.title}</Title>
          <CreateContestForm
            onSubmit={handleFormSubmit}
            onDirtyChange={setFormIsDirty}
            submitLabel="Save"
            contest={contest}
          />
        </Column>
      </LoadingContainer>
      {error && <ErrorModal reason={error.message} onClose={() => reset()} />}
    </Modal>
  )
}
