import { useCallback, useState } from "react"
import { BigNumber } from "ethers"
import axios from "./axios"
import { getUnlockOverTime as getUnlockOverTimeUrl } from "./urls"

type UnlockDataPoint = {
  timestamp: number
  value: BigNumber
}

type GetUnlockOverTimeResponseData =
  | {
      ok: true
      data: {
        timestamp: number
        value: string
      }[]
    }
  | {
      ok: false
      error: string
    }

const parseResponse = (response: GetUnlockOverTimeResponseData): UnlockDataPoint[] | null => {
  if (response.ok === false) return null

  return response.data.map((r) => ({
    timestamp: r.timestamp,
    value: BigNumber.from(r.value),
  }))
}

export const useUnlockOverTime = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<UnlockDataPoint[] | null>(null)

  const getUnlockOverTime = useCallback(async () => {
    try {
      setLoading(true)

      const { data: responseData } = await axios.get<GetUnlockOverTimeResponseData>(getUnlockOverTimeUrl())

      if (responseData.ok === true) {
        setData(parseResponse(responseData))
      } else {
        setData(null)
        setError(new Error(responseData.error))
      }
    } catch (error) {
      console.error(error)
      setData(null)
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    data,
    error,
    getUnlockOverTime,
  }
}
