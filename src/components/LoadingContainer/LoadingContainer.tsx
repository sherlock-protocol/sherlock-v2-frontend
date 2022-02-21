import React from "react"
import { useDebounce } from "use-debounce"
import Loading from "../Loading/Loading"
import styles from "./LoadingContainer.module.scss"

interface Props {
  /**
   * If underlying content should be disabled and
   * a loading indicator should be shown.
   */
  loading?: boolean
}

const LoadingContainer: React.FC<Props> = ({ children, loading }) => {
  const [debouncedLoading] = useDebounce(loading, 200)
  console.log("Loading", loading)
  console.log("Debounced loading", debouncedLoading)

  return (
    <div className={styles.container}>
      {children}
      {debouncedLoading && (
        <div className={styles.loadingContainer}>
          <Loading variant="Scan" />
        </div>
      )}
    </div>
  )
}

export default LoadingContainer
