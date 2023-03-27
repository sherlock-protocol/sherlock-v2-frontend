import { useCallback } from "react"
import { Column } from "../../../components/Layout"
import { Modal, Props as ModalProps } from "../../../components/Modal/Modal"
import { Text } from "../../../components/Text"
import { ContestsListItem } from "../../../hooks/api/admin/useAdminContests"
import { AdminApproveStartAction } from "./AdminApproveStartAction"
import { ContestAction } from "./AdminContestsList"
import { AdminPublishAction } from "./AdminPublishAction"

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
