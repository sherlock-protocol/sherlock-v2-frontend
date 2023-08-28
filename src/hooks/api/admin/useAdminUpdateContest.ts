import { DateTime } from "luxon"
import { useMutation, useQueryClient } from "react-query"
import { contests as contestsAPI } from "../axios"
import { adminUpdateContest as adminUpdateContestUrl } from "../urls"
import { AxiosError } from "axios"
import { adminContestsQuery } from "./useAdminContests"

type AdminUpdateContestParams = {
  id: number
  title: string
  shortDescription: string
  nSLOC: string
  startDate: DateTime
  endDate: DateTime
  auditRewards: number
  judgingPrizePool: number
  leadJudgeFixedPay: number
  fullPayment: number
}

export const useAdminUpdateContest = () => {
  const queryClient = useQueryClient()
  const { mutate, mutateAsync, ...mutation } = useMutation<void, Error, AdminUpdateContestParams>(
    async (params) => {
      try {
        await contestsAPI.put(adminUpdateContestUrl(params.id), {
          title: params.title,
          short_description: params.shortDescription,
          lines_of_code: params.nSLOC,
          starts_at: params.startDate.toSeconds(),
          ends_at: params.endDate.toSeconds(),
          audit_rewards: params.auditRewards,
          judging_prize_pool: params.judgingPrizePool,
          lead_judge_fixed_pay: params.leadJudgeFixedPay,
          full_payment: params.fullPayment,
        })
      } catch (error) {
        const axiosError = error as AxiosError
        throw Error(axiosError.response?.data.error ?? "Something went wrong. Please, try again.")
      }
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(adminContestsQuery("active"))
        await queryClient.invalidateQueries(adminContestsQuery("finished"))
      },
    }
  )

  return {
    updateContest: mutate,
    ...mutation,
  }
}
