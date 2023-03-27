import { useCallback, useEffect } from "react"
import { Button } from "../../../components/Button"
import { Column, Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { useAdminApproveContest } from "../../../hooks/api/admin/useAdminApproveContest"
import { AdminActionHeader } from "./AdminActionHeader"
import { ActionProps } from "./ConfirmContestActionModal"
import { ContestAnnouncementTweetPreview } from "./ContestAnnouncementTweetPreview"

type Props = Omit<ActionProps, "action">

export const AdminPublishAction: React.FC<Props> = ({ contest, force, onCancel, onConfirm }) => {
  const {
    approve: approveContest,
    isLoading: isLoadingContestApproval,
    isSuccess: approveContestSuccess,
  } = useAdminApproveContest()

  useEffect(() => {
    if (approveContestSuccess) {
      onConfirm()
    }
  }, [approveContestSuccess, onConfirm])

  const handleConfirmClick = useCallback(() => {
    approveContest({
      contestID: contest.id,
      force,
    })
  }, [approveContest, contest, force])

  return (
    <LoadingContainer loading={isLoadingContestApproval}>
      <Column alignment={["center", "start"]} spacing="l">
        <AdminActionHeader contest={contest} />
        <Column spacing="s" alignment={"center"}>
          <Text>Make contest visible on the frontend</Text>
          <Text>Announce new contest on Twitter & Discord</Text>

          <Title variant="h3">Tweet preview</Title>
          <ContestAnnouncementTweetPreview contestID={contest.id} />
        </Column>
        <Row spacing="l">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirmClick}>Confirm</Button>
        </Row>
      </Column>
    </LoadingContainer>
  )
}
