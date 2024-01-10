import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"

type GetAdminContestVariablesResponse = {
  min_total_rewards: number
  min_contest_rewards: number
  min_total_price: number
  rec_total_rewards: number
  rec_contest_rewards: number
  rec_total_price: number
  spreadsheet_row: number
  lead_judge_fixed_pay: number
  judging_prize_pool: number
  length: number
}

type ContestVariables = {
  minTotalRewards: number
  minContestRewards: number
  minTotalPrice: number
  recTotalRewards: number
  recContestRewards: number
  recTotalPrice: number
  spreadsheetRow: number
  leadJudgeFixedPay: number
  judgingPrizePool: number
  length: number
}

export const adminContestVariablesQueryKey = (nSLOC: number) => ["contest-variables", nSLOC]
export const useAdminContestVariables = (nSLOC: number) =>
  useQuery<ContestVariables, Error>(adminContestVariablesQueryKey(nSLOC), async () => {
    const { data } = await contestsAPI.get<GetAdminContestVariablesResponse>(`/admin/contest/variables?nsloc=${nSLOC}`)

    return {
      minTotalRewards: data.min_total_rewards,
      minContestRewards: data.min_contest_rewards,
      minTotalPrice: data.min_total_price,
      recTotalRewards: data.rec_total_rewards,
      recContestRewards: data.rec_contest_rewards,
      recTotalPrice: data.rec_total_price,
      spreadsheetRow: data.spreadsheet_row,
      leadJudgeFixedPay: data.lead_judge_fixed_pay,
      judgingPrizePool: data.judging_prize_pool,
      length: data.length,
    }
  })
