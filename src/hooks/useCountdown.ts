import React from "react"

const getNow = () => {
  return Math.floor(Date.now() / 1000)
}

const useCountdown = (timestamp: number) => {
  const [ended, setEnded] = React.useState(getNow() > timestamp ? true : false)
  const [secondsLeft, setSecondsLeft] = React.useState(0)

  const tick = React.useCallback(() => {
    const now = getNow()

    if (now > timestamp) {
      setEnded(true)
    }

    setSecondsLeft(timestamp - now)
  }, [timestamp])

  /**
   * Set initial state
   */
  React.useEffect(() => {
    if (ended) {
      return
    }

    tick()
  }, [ended, tick])

  React.useEffect(() => {
    if (ended) {
      return
    }

    const interval = setInterval(tick, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [tick, ended])

  return React.useMemo(() => ({ ended, secondsLeft }), [ended, secondsLeft])
}

export default useCountdown
