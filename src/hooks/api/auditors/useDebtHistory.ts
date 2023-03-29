import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"
import { getDebtHistory as getDebtHistoryUrl } from "../urls"

export type Debt = {
  id: number
  amount: number
  created_at: Date
  type: string
  escalationUrl: string | null
  contestTitle: string | null
}

type GetDebtHistoryResponse = {
  id: number
  amount: number
  created_at: number
  type: string
  escalation_url: string | null
  contest_title: string | null
}

export const debtHistoryQuery = () => "debt-history"
export const useDebtHistory = () =>
  useQuery<Debt[], Error>(debtHistoryQuery(), async () => {
    const { data } = await contestsAPI.get<GetDebtHistoryResponse[]>(getDebtHistoryUrl())

    return data.map((item) => ({
      id: item.id,
      amount: item.amount,
      created_at: new Date(item.created_at * 1000),
      type: item.type,
      escalationUrl: item.escalation_url,
      contestTitle: item.contest_title,
    }))
  })
