import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"

type GetAdminContestVariablesResponse = {
  length: number
  full_payment: number
  contest_rewards: number
  judging_prize_pool: number
  lead_judge_fixed_pay: number
}

type ContestVariables = {
  length: number
  fullPayment: number
  auditContestRewards: number
  judgingPrizePool: number
  leadJudgeFixedPay: number
}

export const adminContestVariablesQueryKey = (nSLOC: number) => ["contest-variables", nSLOC]
export const useAdminContestVariables = (nSLOC: number) =>
  useQuery<ContestVariables, Error>(adminContestVariablesQueryKey(nSLOC), async () => {
    const { data } = await contestsAPI.get<GetAdminContestVariablesResponse>(`/admin/contest/variables?nsloc=${nSLOC}`)

    return {
      length: data.length,
      fullPayment: data.full_payment,
      auditContestRewards: data.contest_rewards,
      judgingPrizePool: data.judging_prize_pool,
      leadJudgeFixedPay: data.lead_judge_fixed_pay,
    }
  })
