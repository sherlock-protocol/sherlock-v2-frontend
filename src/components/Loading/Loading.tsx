import React from "react"
import { Column } from "../Layout"
import { Text } from "../Text"
import styles from "./Loading.module.scss"

type LoadingVariant = "Scan" | "Layer"

interface Props {
  /**
   * Label shown below loading indicator
   */
  label?: string

  /**
   * Loading indicator variant
   */
  variant?: LoadingVariant

  /**
   * Indicator size.
   *
   * Currently, only `Scan` type indicator supports custom size.
   */
  size?: number
}

/**
 * Loading indicator
 */
const Loading: React.FC<Props> = ({ label, variant = "Scan", size = 120 }) => {
  const indicator = React.useMemo(() => {
    switch (variant) {
      case "Scan":
        return (
          <div className={styles.scanContainer} style={{ height: size, width: size }}>
            <div className={styles.scan} />
          </div>
        )
      case "Layer":
        return (
          <div className={styles.layersContainer}>
            <div className={styles.layer} />
            <div className={styles.layer} />
            <div className={styles.layer} />
            <div className={styles.layer} />
          </div>
        )
      default:
        return null
    }
  }, [variant, size])

  return (
    <Column alignment="center" spacing="m">
      {indicator}
      {label && <Text strong>{label}</Text>}
    </Column>
  )
}

export default Loading
