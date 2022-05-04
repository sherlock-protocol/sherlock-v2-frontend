import { useCallback, useState } from "react"
import axios from "./axios"
import { getAPYOverTime as getAPYOverTimeUrl } from "./urls"

type APYDataPoint = {
  timestamp: number
  value: number
}

type GetAPYOverTimeResponseData =
  | {
      ok: true
      data: {
        timestamp: number
        value: number
      }[]
    }
  | {
      ok: false
      error: string
    }

const parseResponse = (response: GetAPYOverTimeResponseData): APYDataPoint[] | null => {
  if (response.ok === false) return null

  return response.data.map((r) => ({
    timestamp: r.timestamp,
    value: +(r.value * 100).toFixed(2),
  }))
}

export const useAPYOverTime = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<APYDataPoint[] | null>(null)

  const getAPYOverTime = useCallback(async () => {
    try {
      setLoading(true)

      const { data: responseData } = await axios.get<GetAPYOverTimeResponseData>(getAPYOverTimeUrl())

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
    getAPYOverTime,
  }
}
