import { useMutation, useQueryClient } from "react-query"
import { adminContestsQuery } from "./useAdminContests"
import { adminCreateContest as adminCreateContestUrl } from "../urls"
import { contests as contestsAPI } from "../axios"
import { DateTime } from "luxon"
import { AxiosError } from "axios"

type AdminCreateContestParams = {
  protocol: {
    id?: number
    logoUrl?: string
    githubTeam?: string
    twitter?: string
    website?: string
  }
  contest: {
    title: string
    shortDescription: string
    nSLOC: string
    startDate: DateTime
    endDate: DateTime
    auditPrizePool: number
    judgingPrizePool: number
    leadSeniorAuditorFixedPay: number
    leadJudgeFixedPay: number
    fullPayment: number
  }
}

export const useAdminCreateContest = () => {
  const queryClient = useQueryClient()
  const { mutate, mutateAsync, ...mutation } = useMutation<void, Error, AdminCreateContestParams>(
    async (params) => {
      try {
        await contestsAPI.post(adminCreateContestUrl(), {
          protocol: {
            id: params.protocol.id,
            logo_url: params.protocol.logoUrl,
            github_team: params.protocol.githubTeam,
            twitter: params.protocol.twitter,
            website: params.protocol.website,
          },
          title: params.contest.title,
          short_description: params.contest.shortDescription,
          expected_lines_of_code: params.contest.nSLOC,
          starts_at: params.contest.startDate.toSeconds(),
          ends_at: params.contest.endDate.toSeconds(),
          prize_pool: params.contest.auditPrizePool,
          judging_prize_pool: params.contest.judgingPrizePool,
          lead_senior_auditor_fixed_pay: params.contest.leadSeniorAuditorFixedPay,
          lead_judge_fixed_pay: params.contest.leadJudgeFixedPay,
          full_payment: params.contest.fullPayment,
        })
      } catch (error) {
        const axiosError = error as AxiosError
        throw Error(axiosError.response?.data.error ?? "Something went wrong. Please, try again.")
      }
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(adminContestsQuery())
      },
    }
  )

  return {
    createContest: mutate,
    ...mutation,
  }
}
