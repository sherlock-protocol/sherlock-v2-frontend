import React from "react"

const getNow = () => {
  return Math.floor(Date.now() / 1000)
}

const useCountdown = (startTimestamp: number, endTimestamp: number) => {
  const [started] = React.useState(getNow() > startTimestamp)
  const [ended, setEnded] = React.useState(started ? getNow() > endTimestamp : false)
  const [secondsLeft, setSecondsLeft] = React.useState(0)

  const tick = React.useCallback(() => {
    const now = getNow()

    if (now > endTimestamp) {
      setEnded(true)
    } else {
      setSecondsLeft(endTimestamp - now)
    }
  }, [endTimestamp])

  /**
   * Set initial state
   */
  React.useEffect(() => {
    if (ended || !started) {
      return
    }

    tick()
  }, [ended, tick, started])

  React.useEffect(() => {
    if (ended || !started) {
      return
    }

    const interval = setInterval(tick, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [tick, ended, started])

  return React.useMemo(() => ({ ended, secondsLeft, started }), [ended, secondsLeft, started])
}

export default useCountdown
