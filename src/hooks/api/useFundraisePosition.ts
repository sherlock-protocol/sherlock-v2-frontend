import { useCallback, useState } from "react"
import { BigNumber, ethers } from "ethers"
import axios from "./axios"
import { getFundraisePosition as getFundraisePositionUrl } from "./urls"

type FundraisePosition = {
  claimableAt: Date
  contribution: BigNumber
  reward: BigNumber
  stake: BigNumber
  owner: string
}

type GetFundraisePositionResponseData = {
  claimable_at: number
  contribution: string
  id: string
  reward: string
  stake: string
}

const parseResponseData = (data: GetFundraisePositionResponseData): FundraisePosition => ({
  owner: data.id,
  claimableAt: new Date(data.claimable_at),
  contribution: ethers.utils.parseUnits(data.contribution, 6),
  reward: ethers.utils.parseUnits(data.reward, 18),
  stake: ethers.utils.parseUnits(data.stake, 6),
})

export const useFundraisePosition = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error>()
  const [data, setData] = useState<FundraisePosition>()

  const getFundraisePosition = useCallback(async (account: string) => {
    try {
      setLoading(true)
      const response = await axios.get<GetFundraisePositionResponseData>(getFundraisePositionUrl(account))

      setData(parseResponseData(response.data))
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
