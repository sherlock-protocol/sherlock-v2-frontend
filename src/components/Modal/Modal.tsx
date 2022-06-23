import React, { PropsWithChildren } from "react"
import { Box } from "../Box"
import styles from "./Modal.module.scss"

export interface Props {
  /**
   * If Modal can be closed or not
   */
  closeable?: boolean

  /**
   * Callback when modal is closing
   */
  onClose?: () => void
}

export const Modal: React.FC<PropsWithChildren<Props>> = ({ closeable, children, onClose }) => {
  const [isVisible, setIsVisible] = React.useState(true)

  /**
   * Hide the modal
   */
  const handleClose = React.useCallback(
    (e: React.SyntheticEvent) => {
      if (!closeable) {
        return
      }

      e.stopPropagation()

      setIsVisible(false)
      onClose?.()
    },
    [onClose, closeable]
  )

  if (!isVisible) {
    return null
  }

  return (
    <div className={styles.modal} onClick={handleClose}>
      <Box onClick={(e) => e.stopPropagation()}>{children}</Box>
    </div>
  )
}

export default Modal
