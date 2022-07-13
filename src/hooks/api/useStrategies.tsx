import React, { PropsWithChildren, useCallback, useState } from "react"
import { BigNumber } from "ethers"
import axios from "./axios"
import { getStrategies as getStrategiesUrl } from "./urls"

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

const parseResponse = (response: GetStrategiesResponseData): Strategies => {
  if (response.ok === false) return []

  return response.data.map((p) => ({
    name: p.name,
    address: p.address,
    value: BigNumber.from(p.value),
    timestamp: new Date(p.timestamp * 1000),
    block: p.block,
  }))
}

type StrategiesContextType = {
  getStrategies: () => void
  loading: boolean
  data: Strategies
  error: Error | null
}

const StrategiesContext = React.createContext<StrategiesContextType>({} as StrategiesContextType)

export const useStrategies = () => {
  return React.useContext(StrategiesContext)
}

export const StrategiesProvider: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<Strategies>([])

  const getStrategies = useCallback(async () => {
    try {
      setLoading(true)
      const { data: responseData } = await axios.get<GetStrategiesResponseData>(getStrategiesUrl())

      if (responseData.ok === true) {
        setData(parseResponse(responseData))
      } else {
        setData([])
        setError(new Error(responseData.error))
      }
      setError(null)
    } catch (error) {
      console.error(error)
      setData([])
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  const ctx = React.useMemo(
    () => ({
      getStrategies,
      loading,
      data,
      error,
    }),
    [getStrategies, loading, data, error]
  )

  return <StrategiesContext.Provider value={ctx}>{children}</StrategiesContext.Provider>
}
