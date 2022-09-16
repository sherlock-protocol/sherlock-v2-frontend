import React, { useCallback } from "react"
import axios from "./axios"
import { getLastIndexedBlock } from "./urls"

/**
 * Hook that exposes a method to wait for a block to be indexed.
 */
export const useWaitForBlock = () => {
  const waitForBlock = useCallback(async (blockNumber: number) => {
    try {
      let tryCount = 0
      while (tryCount < 60) {
        const { data: responseData } = await axios.get(getLastIndexedBlock(), { timeout: 60000 })

        if (responseData > blockNumber) {
          return true
        }

        tryCount++

        // Sleep for 1 second between tries
        await new Promise((r) => setTimeout(r, 1000))
      }

      return false
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
