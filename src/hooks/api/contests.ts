import { useCallback, useEffect, useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useAccount, useSignTypedData } from "wagmi"
import { contests as contestsAPI } from "./axios"
import { contestantQueryKey } from "./contests/useContestant"
import { getContests as getContestsUrl, getContest as getContestUrl, contestOptIn as contestOptInUrl } from "./urls"

export type ContestStatus = "CREATED" | "RUNNING" | "JUDGING" | "FINISHED" | "ESCALATING" | "SHERLOCK_JUDGING"

export type Contest = {
  id: number
  title: string
  shortDescription: string
  description?: string
  report?: string
  logoURL?: string
  prizePool: number
  startDate: number // Timestamp in seconds.
  endDate: number // Timestamp in seconds.
  status: ContestStatus
  leadSeniorAuditorFixedPay: number
  leadSeniorAuditorHandle: string
  leadJudgeHandle: string
  leadJudgeFixedPay: number
  private: boolean
  fullPayment: number
  judgingPrizePool?: number
  jugdingEndDate?: number // Timestamp in seconds.
  repo: string
  rewards: number
  judgingRepo: string
  escalationStartDate?: number // Timestamp in seconds.
  scoreSequence?: number
  calcCompleted: boolean
}

export type Scoreboard = {
  handle: string
  senior: boolean
  isTeam: boolean
  score: number
  contestDays: number
  payouts: number
}[]

type GetContestsResponseData = {
  id: number
  title: string
  short_description: string
  logo_url: string
  prize_pool: number
  starts_at: number
  ends_at: number
  status: ContestStatus
  lead_senior_auditor_fixed_pay: number
  lead_senior_auditor_handle: string
  lead_judge_handle: string
  lead_judge_fixed_pay: number
  private: boolean
  full_payment: number
  judging_ends_at?: number
  judging_prize_pool: number | null
  template_repo_name: string
  rewards: number
  judging_repo_name: string
  escalation_started_at?: number
  score_sequence?: number
  calc_completed: boolean
}[]

export const contestsQueryKey = "contests"
export const useContests = () =>
  useQuery<Contest[], Error>(contestsQueryKey, async () => {
    const { data: response } = await contestsAPI.get<GetContestsResponseData>(getContestsUrl())

    return response.map((d) => ({
      id: d.id,
      title: d.title,
      shortDescription: d.short_description,
      logoURL: d.logo_url,
      prizePool: d.prize_pool,
      startDate: d.starts_at,
      endDate: d.ends_at,
      status: d.status,
      leadSeniorAuditorFixedPay: d.lead_senior_auditor_fixed_pay,
      leadSeniorAuditorHandle: d.lead_senior_auditor_handle,
      private: d.private,
      fullPayment: d.full_payment,
      judgingPrizePool: d.judging_prize_pool ?? undefined,
      jugdingEndDate: d.judging_ends_at,
      repo: d.template_repo_name,
      rewards: d.rewards,
      leadJudgeHandle: d.lead_judge_handle,
      leadJudgeFixedPay: d.lead_judge_fixed_pay,
      judgingRepo: d.judging_repo_name,
      escalationStartDate: d.escalation_started_at,
      scoreSequence: d.score_sequence,
      calcCompleted: d.calc_completed,
    }))
  })

type GetContestResponseData = {
  id: number
  title: string
  short_description: string
  logo_url: string
  prize_pool: number
  starts_at: number
  ends_at: number
  status: ContestStatus
  description?: string
  report?: string
  lead_senior_auditor_fixed_pay: number
  lead_senior_auditor_handle: string
  private: boolean
  full_payment: number
  judging_prize_pool: number | null
  judging_ends_at?: number
  template_repo_name: string
  lead_judge_handle: string
  lead_judge_fixed_pay: number
  rewards: number
  judging_repo_name: string
  escalation_started_at?: number
  score_sequence: number
  calc_completed: boolean
}

export const contestQueryKey = (id: number) => ["contest", id]
export const useContest = (id: number) =>
  useQuery<Contest, Error>(
    contestQueryKey(id),
    async () => {
      const { data: response } = await contestsAPI.get<GetContestResponseData>(getContestUrl(id))

      return {
        id: response.id,
        title: response.title,
        shortDescription: response.short_description,
        logoURL: response.logo_url,
        prizePool: response.prize_pool,
        startDate: response.starts_at,
        endDate: response.ends_at,
        status: response.status,
        description: response.description,
        report: response.report,
        leadSeniorAuditorFixedPay: response.lead_senior_auditor_fixed_pay,
        leadSeniorAuditorHandle: response.lead_senior_auditor_handle,
        private: response.private,
        fullPayment: response.full_payment,
        judgingPrizePool: response.judging_prize_pool ?? undefined,
        jugdingEndDate: response.judging_ends_at,
        repo: response.template_repo_name,
        rewards: response.rewards,
        leadJudgeHandle: response.lead_judge_handle,
        leadJudgeFixedPay: response.lead_judge_fixed_pay,
        judgingRepo: response.judging_repo_name,
        escalationStartDate: response.escalation_started_at,
        scoreSequence: response.score_sequence,
        calcCompleted: response.calc_completed,
      }
    },
    {
      refetchOnWindowFocus: false,
    }
  )

export const useOptInOut = (contestId: number, optIn: boolean, handle: string) => {
  const domain = {
    name: "Sherlock Contest",
    version: "1",
  }

  const types = {
    RankingOptIn: [
      { name: "contest_id", type: "uint256" },
      { name: "opt_in", type: "bool" },
    ],
  }

  const value = {
    opt_in: optIn,
    contest_id: contestId,
  }

  const { signTypedData, data: signature, isLoading: signatureIsLoading } = useSignTypedData({ domain, types, value })
  const { address } = useAccount()
  const queryClient = useQueryClient()

  const { isLoading: mutationIsLoading, mutateAsync: doOptIn } = useMutation(async () => {
    await contestsAPI.post(contestOptInUrl(), {
      contest_id: contestId,
      opt_in: optIn,
      signature,
      handle,
    })
  })

  useEffect(() => {
    const optInOut = async () => {
      if (signature) {
        await doOptIn()
        await queryClient.invalidateQueries(contestantQueryKey(address ?? "", contestId))
      }
    }
    optInOut()
  }, [signature, doOptIn, address, contestId, queryClient])

  const signAndOptIn = useCallback(() => {
    signTypedData()
  }, [signTypedData])

  return useMemo(
    () => ({ isLoading: mutationIsLoading || signatureIsLoading, signAndOptIn }),
    [mutationIsLoading, signatureIsLoading, signAndOptIn]
  )
}
