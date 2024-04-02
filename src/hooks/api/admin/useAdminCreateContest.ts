import { useMutation, useQueryClient } from "react-query"
import { adminContestsQuery } from "./useAdminContests"
import { adminCreateContest as adminCreateContestUrl } from "../urls"
import { contests as contestsAPI } from "../axios"
import { DateTime } from "luxon"
import { AxiosError } from "axios"

type AdminCreateContestParams = {
  protocol: {
    id?: number
    name?: string
    logoUrl?: string
    githubTeam?: string
    twitter?: string
    website?: string
  }
  contest: {
    title: string
    previousContestId?: number | null
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
            name: params.protocol.name,
            logo_url: params.protocol.logoUrl,
            github_team: params.protocol.githubTeam,
            twitter: params.protocol.twitter,
            website: params.protocol.website,
          },
          title: params.contest.title,
          previous_contest_id: params.contest.previousContestId,
        })
      } catch (error) {
        const axiosError = error as AxiosError
        throw Error(axiosError.response?.data.error ?? "Something went wrong. Please, try again.")
      }
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(adminContestsQuery("draft"))
        await queryClient.invalidateQueries(adminContestsQuery("active"))
      },
    }
  )

  return {
    createContest: mutate,
    ...mutation,
  }
}
