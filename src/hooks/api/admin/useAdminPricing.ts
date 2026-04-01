import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"

type PricingType = "MINIMUM" | "RECOMMENDED"

type GetAdminPricingResponse = {
  audit_contest_rewards: number
  bottom_3rd_contest_pot: number
  bottom_3rd_lsw_pay: number
  judging_prize_pool: number
  lead_judge_fixed_pay: number
  length: number
  middle_3rd_contest_pot: number
  middle_3rd_lsw_pay: number
  referral_fee: number
  reserved_auditor_fixed_pay: number | null
  sherlock_fee: number
  top_3rd_contest_pot: number
  top_3rd_lsw_pay: number
  total_price: number
  total_rewards: number
  type: PricingType
  exchangeRate: number
}[]

type Pricing = {
  minTotalRewards: number
  minContestRewards: number
  minTotalPrice: number
  minLeadJudgeFixedPay: number
  minJudgingPrizePool: number
  recTotalRewards: number
  recContestRewards: number
  recTotalPrice: number
  recLeadJudgeFixedPay: number
  recJudgingPrizePool: number
  length: number
  exchangeRate: number
}

export const adminPricingQueryKey = (nSLOC: number, token: string) => ["contest-variables", nSLOC, token]
export const useAdminPricing = (nSLOC: number, token: string) =>
  useQuery<Pricing, Error>(adminPricingQueryKey(nSLOC, token), async (): Promise<Pricing> => {
    const { data } = await contestsAPI.get<GetAdminPricingResponse>(
      `/internal/simulate-pricing?nsloc=${nSLOC}&token=${token}`
    )

    const minimumPricing = data.find((p) => p.type === "MINIMUM")
    const recommendedPricing = data.find((p) => p.type === "RECOMMENDED")

    if (!minimumPricing || !recommendedPricing) {
      throw Error("Missing pricing data")
    }

    return {
      minTotalRewards: minimumPricing.total_rewards,
      minContestRewards: minimumPricing.audit_contest_rewards,
      minTotalPrice: minimumPricing.total_price,
      minLeadJudgeFixedPay: minimumPricing.lead_judge_fixed_pay,
      minJudgingPrizePool: minimumPricing.judging_prize_pool,
      recTotalRewards: recommendedPricing.total_rewards,
      recContestRewards: recommendedPricing.audit_contest_rewards,
      recTotalPrice: recommendedPricing.total_price,
      recLeadJudgeFixedPay: recommendedPricing.lead_judge_fixed_pay,
      recJudgingPrizePool: recommendedPricing?.judging_prize_pool,
      length: minimumPricing.length,
      exchangeRate: minimumPricing.exchangeRate,
    }
  })
