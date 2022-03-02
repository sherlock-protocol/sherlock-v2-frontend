import React from "react"
import { CgClose } from "react-icons/cg"
import styles from "./CloseButton.module.scss"

interface Props {
  /**
   * Button size
   */
  size?: number

  /**
   * On click event handler
   */
  onClick?: (e: React.SyntheticEvent) => void
}

const CloseButton: React.FC<Props> = ({ size = 16, onClick }) => {
  return <CgClose size={size} className={styles.icon} onClick={onClick} />
}

export default CloseButton
