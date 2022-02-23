import { useCallback, useState } from "react"
import { BigNumber, ethers } from "ethers"
import axios from "./axios"
import { getFundraisePosition as getFundraisePositionUrl } from "./urls"
import { TypeOfTag } from "typescript"

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

const parseResponseData = (data: GetFundraisePositionResponseData["data"]): FundraisePosition => ({
  owner: data.id,
  claimableAt: new Date(data.claimable_at),
  contribution: BigNumber.from(data.contribution),
  reward: BigNumber.from(data.reward),
  stake: BigNumber.from(data.stake),
})

export const useFundraisePosition = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>()
  const [data, setData] = useState<FundraisePosition | null>()

  const getFundraisePosition = useCallback(async (account: string) => {
    try {
      setLoading(true)
      const { data: responseData } = await axios.get<GetFundraisePositionResponseData>(getFundraisePositionUrl(account))

      if (responseData.ok) {
        setData(parseResponseData(responseData.data))
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

  return {
    getFundraisePosition,
    loading,
    data,
    error,
  }
}
