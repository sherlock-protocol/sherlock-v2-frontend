import React from "react"
import { Text } from "../Text"

import styles from "./Warning.module.scss"

type Props = {
  message: string
}

export const Warning: React.FC<Props> = ({ message }) => {
  return (
    <div className={styles.warningContainer}>
      <Text>{message}</Text>
    </div>
  )
}
