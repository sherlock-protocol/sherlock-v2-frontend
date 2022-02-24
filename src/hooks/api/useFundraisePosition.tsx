import React, { useCallback, useState } from "react"
import { BigNumber } from "ethers"
import axios from "./axios"
import { getFundraisePosition as getFundraisePositionUrl } from "./urls"

type FundraisePosition = {
  claimableAt: Date
  contribution: BigNumber
  reward: BigNumber
  stake: BigNumber
  owner: string
}

type GetFundraisePositionResponseData =
  | {
      data: {
        claimable_at: number
        contribution: string
        id: string
        reward: string
        stake: string
      }
      ok: true
    }
  | {
      error: string
      ok: false
    }

const parseResponse = (response: GetFundraisePositionResponseData): FundraisePosition | null => {
  if (response.ok === false) return null

  return {
    owner: response.data.id,
    claimableAt: new Date(response.data.claimable_at),
    contribution: BigNumber.from(response.data.contribution),
    reward: BigNumber.from(response.data.reward),
    stake: BigNumber.from(response.data.stake),
  }
}

type FundraisePositionContextType = {
  getFundraisePosition: (account: string) => void
  loading: boolean
  data: FundraisePosition | null
  error: Error | null
}

const FundraisePositionContext = React.createContext<FundraisePositionContextType>({} as FundraisePositionContextType)

export const useFundraisePosition = () => {
  return React.useContext(FundraisePositionContext)
}

export const FundraisePositionProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<FundraisePosition | null>(null)

  const getFundraisePosition = useCallback(async (account: string) => {
    try {
      setLoading(true)

      const response = await axios.get<GetFundraisePositionResponseData>(getFundraisePositionUrl(account))

      setData(parseResponse(response.data))
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
      getFundraisePosition,
      loading,
      data,
      error,
    }),
    [getFundraisePosition, loading, data, error]
  )

  return <FundraisePositionContext.Provider value={ctx}>{children}</FundraisePositionContext.Provider>
}
