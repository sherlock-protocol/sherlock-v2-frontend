import { useCallback } from "react"
import { Modal, Props as ModalProps } from "../../../components/Modal/Modal"
import { ContestsListItem } from "../../../hooks/api/admin/useAdminContests"
import { AdminApproveStartAction } from "./AdminApproveStartAction"
import { ContestAction } from "./AdminContestsListActive"
import { AdminPublishAction } from "./AdminPublishAction"
import { AdminSelectSeniorAction } from "./AdminSelectSeniorAction"

type Props = Omit<ModalProps, "onClose"> & {
  contest: ContestsListItem
  action: ContestAction
  force: boolean
  onClose?: (confirmed: boolean) => void
}

export type ActionProps = {
  action: ContestAction
  contest: ContestsListItem
  force: boolean
  onCancel: () => void
  onConfirm: () => void
}

const Action: React.FC<ActionProps> = ({ action, ...props }) => {
  switch (action) {
    case "START_SENIOR_SELECTION":
      return <AdminSelectSeniorAction {...props} />
    case "PUBLISH":
      return <AdminPublishAction {...props} />
    case "APPROVE_START":
      return <AdminApproveStartAction {...props} />
  }

  return null
}

export const ConfirmContestActionModal: React.FC<Props> = ({ contest, action, onClose, force = false }) => {
  const handleConfirmClick = useCallback(() => {
    onClose?.(true)
  }, [onClose])

  const handleCancelClick = useCallback(() => {
    onClose?.(false)
  }, [onClose])

  return (
    <Modal closeable onClose={() => onClose?.(false)}>
      <Action
        contest={contest}
        force={force}
        action={action}
        onCancel={handleCancelClick}
        onConfirm={handleConfirmClick}
      />
    </Modal>
  )
}
