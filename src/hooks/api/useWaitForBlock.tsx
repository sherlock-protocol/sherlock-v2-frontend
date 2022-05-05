import React, { useCallback } from "react"
import axios from "./axios"
import { getWaitForBlock } from "./urls"

/**
 * Hook that exposes a method to wait for a block to be indexed.
 */
export const useWaitForBlock = () => {
  const waitForBlock = useCallback(async (blockNumber: number) => {
    try {
      const { data: responseData } = await axios.get(getWaitForBlock(blockNumber), { timeout: 60000 })

      if (responseData.ok === true) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
  }, [])

  return React.useMemo(
    () => ({
      waitForBlock,
    }),
    [waitForBlock]
  )
}
