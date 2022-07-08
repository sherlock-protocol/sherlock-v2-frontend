import React from "react"
import Cookies from "js-cookie"

/**
 * React Hook for checking if the user is USA based.
 *
 * Reads the user's cookies and looks for `USA=1` cookie,
 * set by the nginx proxy.
 */
const useIsUSA = () => {
  const [isUSA, setIsUSA] = React.useState(false)

  React.useEffect(() => {
    const cookie = Cookies.get("USA")

    setIsUSA(cookie === "1")
  }, [])

  return React.useMemo(() => isUSA, [isUSA])
}

export default useIsUSA
