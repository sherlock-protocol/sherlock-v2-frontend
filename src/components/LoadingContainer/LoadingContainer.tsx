import React, { PropsWithChildren } from "react"
import { useDebounce } from "use-debounce"
import Loading from "../Loading/Loading"
import styles from "./LoadingContainer.module.scss"

interface Props {
  /**
   * If underlying content should be disabled and
   * a loading indicator should be shown.
   */
  loading?: boolean

  /**
   * Label shown below loading indicator
   */
  label?: string
}

const LoadingContainer: React.FC<PropsWithChildren<Props>> = ({ children, loading, label }) => {
  const [debouncedLoading] = useDebounce(loading, 200)

  return (
    <div className={styles.container}>
      {children}
      {debouncedLoading && (
        <div className={styles.loadingContainer}>
          <Loading variant="Scan" label={label} />
        </div>
      )}
    </div>
  )
}

export default LoadingContainer
