import { useMutation, useQueryClient } from "react-query"
import { contests as contestsAPI } from "../axios"
import { adminSelectLeadSeniorWatson as adminSelectLeadSeniorWatsonUrl } from "../urls"
import { adminContestsQuery } from "./useAdminContests"

type AdminSelectLeadSeniorWatsonParams = {
  contestID: number
  seniorWatsonID: number
  force: boolean
}

export const useAdminSelectLeadSeniorWatson = () => {
  const queryClient = useQueryClient()
  const { mutate, mutateAsync, ...mutation } = useMutation<void, Error, AdminSelectLeadSeniorWatsonParams>(
    async (params) => {
      await contestsAPI.post(adminSelectLeadSeniorWatsonUrl(), {
        contest_id: params.contestID,
        senior_watson_id: params.seniorWatsonID,
        force: params.force,
      })
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(adminContestsQuery())
      },
    }
  )

  return {
    selectLeadSeniorWatson: mutate,
    ...mutation,
  }
}
