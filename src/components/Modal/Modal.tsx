import React from "react"
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
  const handleClose = React.useCallback(() => {
    if (!closeable) {
      return
    }

    setIsVisible(false)
    onClose?.()
  }, [onClose, closeable])

  if (!isVisible) {
    return null
  }

  return (
    <div className={styles.modal} onClick={handleClose}>
      <div className={styles.container}>
        {closeable && (
          <div className={styles.header}>
            <button onClick={handleClose}>X</button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export default Modal
