import React, { PropsWithChildren, useCallback, useState } from "react"
import { BigNumber, ethers } from "ethers"
import axios from "./axios"
import { getFundraisePosition as getFundraisePositionUrl } from "./urls"
import { DateTime } from "luxon"

type FundraisePosition = {
  claimableAt: DateTime
  contribution: BigNumber
  reward: BigNumber
  stake: BigNumber
  owner: string
  claimedAt: DateTime | null
}

type GetFundraisePositionResponseData =
  | {
      data: {
        claimable_at: number
        contribution: string
        id: string
        reward: string
        stake: string
        claimed_at: number | null
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
    claimableAt: DateTime.fromSeconds(response.data.claimable_at),
    contribution: BigNumber.from(response.data.contribution),
    reward: BigNumber.from(response.data.reward),
    stake: BigNumber.from(response.data.stake),
    claimedAt: response.data.claimed_at ? DateTime.fromSeconds(response.data.claimed_at) : null,
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

export const FundraisePositionProvider: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<FundraisePosition | null>(null)

  const getFundraisePosition = useCallback(async (account: string) => {
    try {
      setLoading(true)

      const checksummedAddress = ethers.utils.getAddress(account)
      const response = await axios.get<GetFundraisePositionResponseData>(getFundraisePositionUrl(checksummedAddress))

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
