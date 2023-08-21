import { useCallback, useEffect, useState } from "react"
import { Button } from "../../../components/Button"
import { Column, Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import Modal, { Props as ModalProps } from "../../../components/Modal/Modal"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { useAdminCreateContest } from "../../../hooks/api/admin/useAdminCreateContest"
import { ErrorModal } from "../../../pages/ContestDetails/ErrorModal"
import { CreateContestForm } from "./CreateContestForm"

type Props = ModalProps & {}

export const CreateContestModal: React.FC<Props> = ({ onClose }) => {
  const [formIsDirty, setFormIsDirty] = useState(false)
  const { createContest, isLoading, isSuccess, error, reset } = useAdminCreateContest()

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
      <LoadingContainer loading={isLoading} label={`Creating contest ...`}>
        <Column spacing="xl">
          <Title>New contest</Title>
          <CreateContestForm onSubmit={createContest} onDirtyChange={setFormIsDirty} submitLabel="Create Contest" />
        </Column>
      </LoadingContainer>
      {error && <ErrorModal reason={error.message} onClose={() => reset()} />}
    </Modal>
  )
}
