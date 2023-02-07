import { useCallback, useEffect } from "react"
import { Button } from "../../../components/Button"
import { Column, Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import { Modal, Props as ModalProps } from "../../../components/Modal/Modal"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { useAdminApproveContest } from "../../../hooks/api/admin/useAdminApproveContest"
import { useAdminApproveStart } from "../../../hooks/api/admin/useAdminApproveStart"
import { ContestsListItem } from "../../../hooks/api/admin/useAdminContests"
import { ContestAction } from "./AdminContestsList"

import styles from "./AdminContestsList.module.scss"
import { ContestAnnouncementTweetPreview } from "./ContestAnnouncementTweetPreview"

type Props = Omit<ModalProps, "onClose"> & {
  contest: ContestsListItem
  action: ContestAction
  force: boolean
  onClose?: (confirmed: boolean) => void
}

const getActionTitle = (action: ContestAction): string => {
  switch (action) {
    case "PUBLISH":
      return "Publish contest"
    case "APPROVE_START":
      return "Approve contest start"
  }
}

const renderDescription = (contest: ContestsListItem, action: ContestAction) => {
  switch (action) {
    case "PUBLISH":
      return (
        <Column spacing="s" alignment={"center"}>
          <Text>Make contest visible on the frontend</Text>
          <Text>Announce new contest on Twitter & Discord</Text>

          <Title variant="h3">Tweet preview</Title>
          <ContestAnnouncementTweetPreview contestID={contest.id} />
        </Column>
      )
    case "APPROVE_START":
      return (
        <Column spacing="s" alignment={"center"}>
          <Text>Approve contest to start on start_date</Text>
          <Text>Set contest repo permissions to read-only for protocol team</Text>
        </Column>
      )
  }
}

export const ConfirmContestActionModal: React.FC<Props> = ({ contest, action, onClose, force = false }) => {
  const {
    approve: approveContest,
    isLoading: isLoadingContestApproval,
    isSuccess: approveContestSuccess,
  } = useAdminApproveContest()
  const {
    approve: approveStart,
    isLoading: isLoadingStartApproval,
    isSuccess: approveStartSuccess,
  } = useAdminApproveStart()

  useEffect(() => {
    if (approveContestSuccess || approveStartSuccess) {
      onClose?.(true)
    }
  }, [approveContestSuccess, approveStartSuccess, onClose])

  const handleConfirmClick = useCallback(() => {
    if (action === "PUBLISH") {
      approveContest({
        contestID: contest.id,
        force,
      })
    } else if (action === "APPROVE_START") {
      approveStart({
        contestID: contest.id,
        force,
      })
    }
  }, [approveStart, approveContest, contest, action, force])

  const handleCancelClick = useCallback(() => {
    onClose?.(false)
  }, [onClose])

  return (
    <Modal closeable onClose={() => onClose?.(false)}>
      <LoadingContainer loading={isLoadingContestApproval || isLoadingStartApproval}>
        <Column alignment={["center", "start"]} spacing="l">
          <Title>{getActionTitle(action)}</Title>
          <Row spacing="s" alignment={["center", "center"]}>
            <img src={contest.logoURL} className={styles.logo} alt={contest.title} />
            <Text strong>{contest.title}</Text>
          </Row>
          {renderDescription(contest, action)}
          <Row spacing="l">
            <Button variant="secondary" onClick={handleCancelClick}>
              Cancel
            </Button>
            <Button onClick={handleConfirmClick}>Confirm</Button>
          </Row>
        </Column>
      </LoadingContainer>
    </Modal>
  )
}
