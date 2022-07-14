import { BigNumber } from "ethers"
import { useQuery } from "react-query"
import axios from "./axios"
import { getAPYOverTime as getAPYOverTimeUrl, getTVCOverTime as getTVCOverTimeUrl } from "./urls"

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

type DataPoint<T> = {
  timestamp: number
  value: T
}

type GetStatsResponseData =
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

export const tvcOverTimeQueryKey = "tvcOverTime"
export const useTVCOverTime = () =>
  useQuery<DataPoint<BigNumber>[] | null, Error>(tvcOverTimeQueryKey, async () => {
    const { data: response } = await axios.get<GetStatsResponseData>(getTVCOverTimeUrl())

    if (response.ok === false) throw Error(response.error)
    if (response.data === null) return null

    return response.data.map((r) => ({
      timestamp: r.timestamp,
      value: BigNumber.from(r.value),
    }))
  })
