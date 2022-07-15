import { BigNumber } from "ethers"
import axios from "./axios"
import { getStrategies as getStrategiesUrl } from "./urls"
import { useQuery } from "react-query"

export type Strategy = {
  /**
   * Strategy address
   */
  address: string

  /**
   * Strategy name
   */
  name: string

  /**
   * Date when strategy's balance was last computed
   */
  timestamp: Date

  /**
   * Strategy balance
   */
  value: BigNumber

  /**
   * Block when strategy's balance was last computed
   */
  block: number
}

type GetStrategiesResponseData =
  | {
      ok: true
      data: {
        address: string
        block: number
        name: string
        value: string
        timestamp: number
      }[]
    }
  | {
      ok: false
      error: string
    }

type Strategies = Strategy[]

export const strategiesQueryKey = "strategies"
export const useStrategies = () =>
  useQuery<Strategies | null, Error>(strategiesQueryKey, async () => {
    const { data: response } = await axios.get<GetStrategiesResponseData>(getStrategiesUrl())

    if (response.ok === false) throw Error(response.error)
    if (response.data === null) return null

    return response.data.map((p) => ({
      name: p.name,
      address: p.address,
      value: BigNumber.from(p.value),
      timestamp: new Date(p.timestamp * 1000),
      block: p.block,
    }))
  })
