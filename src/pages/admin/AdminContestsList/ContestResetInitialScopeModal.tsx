import { useCallback, useEffect } from "react"
import { Button } from "../../../components/Button"
import { Column, Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import Modal, { Props as ModalProps } from "../../../components/Modal/Modal"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { ContestsListItem } from "../../../hooks/api/admin/useAdminContests"
import { useAdminResetScope } from "../../../hooks/api/admin/useAdminResetScope"

type Props = {
  contest: ContestsListItem
} & ModalProps

export const ContestResetInitialScopeModal: React.FC<Props> = ({ onClose, contest }) => {
  const { resetScope, isLoading, isSuccess } = useAdminResetScope()

  useEffect(() => {
    if (isSuccess) {
      onClose?.()
    }
  }, [isSuccess, onClose])

  const handleResetScope = useCallback(() => {
    resetScope({
      contestID: contest.id,
      scopeType: "initial",
    })
  }, [resetScope, contest.id])

  return (
    <Modal onClose={onClose} closeable>
      <LoadingContainer loading={isLoading} label="Resetting scope">
        <Column spacing="l">
          <Title>{contest.title}: Reset initial scope</Title>
          <Text>Are you sure you want to reset the scope for this contest?</Text>
          <Row spacing="m" alignment="center">
            <Button variant="secondary" onClick={onClose}>
              No, cancel
            </Button>
            <Button variant="alternate" onClick={handleResetScope}>
              Yes, reset
            </Button>
          </Row>
        </Column>
      </LoadingContainer>
    </Modal>
  )
}
