import { useCallback, useEffect, useState } from "react"
import { Button } from "../../../components/Button"
import { Column, Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import Modal, { Props as ModalProps } from "../../../components/Modal/Modal"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { useAdminConfirmContest } from "../../../hooks/api/admin/useAdminConfirmContest"
import { ContestsListItem } from "../../../hooks/api/admin/useAdminContests"
import { ErrorModal } from "../../ContestDetails/ErrorModal"
import { ContestValues, CreateContestForm } from "./CreateContestForm"

type Props = ModalProps & {
  contest: ContestsListItem
}

export const ConfirmContestModal: React.FC<Props> = ({ onClose, contest }) => {
  const [formIsDirty, setFormIsDirty] = useState(false)
  const [displayModalCloseConfirm, setDisplayModalFormConfirm] = useState(false)

  const { confirmContest, isSuccess, isLoading, error, reset } = useAdminConfirmContest()

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
      confirmContest({
        id: contest.id,
        ...values.contest,
      })
    },
    [contest.id, confirmContest]
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
      <LoadingContainer loading={isLoading} label={`Confirming contest ...`}>
        <Column spacing="xl">
          <Title>New contest</Title>
          <CreateContestForm
            onSubmit={handleFormSubmit}
            onDirtyChange={setFormIsDirty}
            submitLabel="Confirm Contest"
            contest={contest}
          />
        </Column>
      </LoadingContainer>
      {error && <ErrorModal reason={error.message} onClose={() => reset()} />}
    </Modal>
  )
}
