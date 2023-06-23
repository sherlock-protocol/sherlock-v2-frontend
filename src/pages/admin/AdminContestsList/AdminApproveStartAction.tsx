import { DateTime } from "luxon"
import { useCallback, useEffect } from "react"
import { Button } from "../../../components/Button"
import { Column, Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import { Text } from "../../../components/Text"
import { useAdminApproveStart } from "../../../hooks/api/admin/useAdminApproveStart"
import { AdminActionHeader } from "./AdminActionHeader"
import { ActionProps } from "./ConfirmContestActionModal"

type Props = Omit<ActionProps, "action">

export const AdminApproveStartAction: React.FC<Props> = ({ contest, force, onCancel, onConfirm }) => {
  const {
    approve: approveStart,
    isLoading: isLoadingStartApproval,
    isSuccess: approveStartSuccess,
  } = useAdminApproveStart()

  useEffect(() => {
    if (approveStartSuccess) {
      onConfirm()
    }
  }, [approveStartSuccess, onConfirm])

  const handleConfirmClick = useCallback(() => {
    approveStart({
      contestID: contest.id,
      force,
    })
  }, [approveStart, contest, force])

  const startDate = DateTime.fromSeconds(contest.startDate)

  return (
    <LoadingContainer loading={isLoadingStartApproval}>
      <Column alignment={["center", "start"]} spacing="xl">
        <AdminActionHeader contest={contest} title="Approve Start" />
        <Column spacing="s" alignment={"center"}>
          <Text>
            Approve contest to start on{" "}
            <strong>{`${startDate.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}`}</strong>
          </Text>
          <Text>Set contest repo permissions to read-only for protocol team</Text>
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
