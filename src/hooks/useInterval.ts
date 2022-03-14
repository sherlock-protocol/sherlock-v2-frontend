import React from "react"

/**
 * setInterval wrapped in a hook
 */
const useInterval = (callback: Function, ms: number) => {
  const savedCallback = React.useRef<Function>(callback)

  React.useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  React.useEffect(() => {
    if (ms) {
      const timer = setInterval(() => savedCallback.current(), ms)

      return () => clearInterval(timer)
    }
  }, [ms])
}

export default useInterval
