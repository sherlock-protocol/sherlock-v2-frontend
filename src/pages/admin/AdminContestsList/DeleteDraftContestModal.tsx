import { useCallback, useEffect } from "react"
import { Button } from "../../../components/Button"
import { Column, Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import Modal, { Props as ModalProps } from "../../../components/Modal/Modal"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { ContestsListItem } from "../../../hooks/api/admin/useAdminContests"
import { useAdminDeleteDraftContest } from "../../../hooks/api/admin/useAdminDeleteDraftContest"

type Props = {
  contest: ContestsListItem
} & ModalProps

export const DeleteDraftContestModal: React.FC<Props> = ({ onClose, contest }) => {
  const { deleteContest, isLoading, isSuccess } = useAdminDeleteDraftContest()

  useEffect(() => {
    if (isSuccess) {
      onClose?.()
    }
  }, [isSuccess, onClose])

  const handleResetScope = useCallback(() => {
    deleteContest({
      contestID: contest?.id,
    })
  }, [deleteContest, contest])

  return (
    <Modal onClose={onClose} closeable>
      <LoadingContainer loading={isLoading} label="Resetting scope">
        <Column spacing="l">
          <Title>{contest?.title}: Delete contest</Title>
          <Text>Are you sure you want to delete this draft contest?</Text>
          <Row spacing="m" alignment="center">
            <Button variant="secondary" onClick={onClose}>
              No, cancel
            </Button>
            <Button variant="alternate" onClick={handleResetScope}>
              Yes, delete it
            </Button>
          </Row>
        </Column>
      </LoadingContainer>
    </Modal>
  )
}
