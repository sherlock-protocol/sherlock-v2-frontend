import React from "react"
import { Box } from "../Box"
import CloseButton from "../CloseButton/CloseButton"
import styles from "./Modal.module.scss"

interface Props {
  /**
   * If Modal can be closed or not
   */
  closeable?: boolean

  /**
   * Callback when modal is closing
   */
  onClose?: () => void
}

const Modal: React.FC<Props> = ({ closeable, children, onClose }) => {
  const [isVisible, setIsVisible] = React.useState(true)

  /**
   * Hide the modal
   */
  const handleClose = React.useCallback(
    (e: React.SyntheticEvent) => {
      e.stopPropagation()

      if (!closeable) {
        return
      }

      setIsVisible(false)
      onClose?.()
    },
    [onClose, closeable]
  )

  if (!isVisible) {
    return null
  }

  return (
    <div className={styles.modal}>
      <Box>
        {closeable && (
          <div className={styles.header}>
            <CloseButton size={22} onClick={handleClose} />
          </div>
        )}
        {children}
      </Box>
    </div>
  )
}

export default Modal
