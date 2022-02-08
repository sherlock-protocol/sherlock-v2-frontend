import React from "react"
import styles from "./Modal.module.scss"

interface Props {
  /**
   * If Modal can be closed or not
   */
  closeable?: boolean
}

const Modal: React.FC<Props> = ({ closeable, children }) => {
  const [isVisible, setIsVibisle] = React.useState(true)

  /**
   * Hide the modal
   */
  const handleClose = React.useCallback(() => {
    setIsVibisle(false)
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <div className={styles.modal}>
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
