import { useCallback, useState } from "react"
import { BigNumber } from "ethers"
import axios from "axios"
import { getTVLOverTime as getTVLOverTimeUrl } from "./urls"

type TVLDataPoint = {
  timestamp: number
  value: BigNumber
}

type GetTVLOverTimeResponseData =
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

const parseResponse = (response: GetTVLOverTimeResponseData): TVLDataPoint[] | null => {
  if (response.ok === false) return null

  return response.data.map((r) => ({
    timestamp: r.timestamp,
    value: BigNumber.from(r.value),
  }))
}

export const useTVLOverTime = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<TVLDataPoint[] | null>(null)

  const getTVLOverTime = useCallback(async () => {
    try {
      setLoading(true)

      const { data: responseData } = await axios.get<GetTVLOverTimeResponseData>(getTVLOverTimeUrl())

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
    getTVLOverTime,
  }
}
