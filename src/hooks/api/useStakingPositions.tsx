import React, { useCallback, useState } from "react"
import { BigNumber } from "ethers"
import axios from "./axios"
import { getStakePositions as getStakePositionUrl } from "./urls"

type StakingPosition = {
  id: number
  owner: string
  sher: BigNumber
  usdc: BigNumber
  lockupEnd: Date
}

type StakingPositions = {
  positions: StakingPosition[]
  usdcAPY: number
  usdcIncrementFactor50ms: number
}

type GetStakingPositionsResponseData =
  | {
      ok: true
      data: {
        id: number
        lockup_end: number
        owner: string
        sher: string
        usdc: string
      }[]
      usdc_apy: number
      usdc_increment_50ms_factor: number
    }
  | {
      ok: false
      error: string
    }

const parseResponse = (response: GetStakingPositionsResponseData): StakingPositions | null => {
  if (response.ok === false) return null

  return {
    positions: response.data.map((p) => ({
      id: p.id,
      owner: p.owner,
      sher: BigNumber.from(p.sher),
      usdc: BigNumber.from(p.usdc),
      lockupEnd: new Date(p.lockup_end * 1000),
    })),
    usdcAPY: response.usdc_apy,
    usdcIncrementFactor50ms: response.usdc_increment_50ms_factor,
  }
}

type StakingPositionContextType = {
  getStakingPositions: (account: string) => void
  loading: boolean
  data: StakingPositions | null
  error: Error | null
}

const StakingPositionsContext = React.createContext<StakingPositionContextType>({} as StakingPositionContextType)

export const useStakingPositions = () => {
  return React.useContext(StakingPositionsContext)
}

export const StakingPositionsProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<StakingPositions | null>(null)

  const getStakingPositions = useCallback(async (account: string) => {
    try {
      setLoading(true)
      const { data: responseData } = await axios.get<GetStakingPositionsResponseData>(getStakePositionUrl(account))

      if (responseData.ok === true) {
        setData(parseResponse(responseData))
      } else {
        setData(null)
        setError(new Error(responseData.error))
      }
      setError(null)
    } catch (error) {
      setData(null)
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  const ctx = React.useMemo(
    () => ({
      getStakingPositions,
      loading,
      data,
      error,
    }),
    [getStakingPositions, loading, data, error]
  )

  return <StakingPositionsContext.Provider value={ctx}>{children}</StakingPositionsContext.Provider>
}
