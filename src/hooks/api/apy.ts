import { useQuery } from "react-query"
import axios from "./axios"
import { getAPYOverTime as getAPYOverTimeUrl } from "./urls"

type APYDataPoint = {
  timestamp: number
  totalAPY: number
  premiumsAPY: number
}

type GetAPYOverTimeResponseData =
  | {
      ok: true
      data: {
        timestamp: number
        value: number
        premiums_apy: number
      }[]
    }
  | {
      ok: false
      error: string
    }

export const apyOverTimeQueryKey = "apyOverTime"
export const useAPYOverTime = () =>
  useQuery<APYDataPoint[] | null, Error>(apyOverTimeQueryKey, async () => {
    const { data: response } = await axios.get<GetAPYOverTimeResponseData>(getAPYOverTimeUrl())

    if (response.ok === false) throw Error(response.error)
    if (response.data === null) return null

    return response.data.map((r) => ({
      timestamp: r.timestamp,
      totalAPY: +(r.value * 100).toFixed(2),
      premiumsAPY: +(r.premiums_apy * 100).toFixed(2),
    }))
  })
