import { useCallback, useState } from "react"
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

export const useFundraisePosition = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>()
  const [data, setData] = useState<FundraisePosition | null>()

  const getFundraisePosition = useCallback(async (account: string) => {
    try {
      setLoading(true)

      const response = await axios.get<GetFundraisePositionResponseData>(getFundraisePositionUrl(account))

      setData(parseResponse(response.data))
      setError(null)
    } catch (error) {
      setData(null)
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    getFundraisePosition,
    loading,
    data,
    error,
  }
}
