import { useMutation, useQueryClient } from "react-query"
import { contests as contestsAPI } from "../axios"
import { adminStartLeadSeniorWatsonSelection as adminStartLeadSeniorWatsonSelectionUrl } from "../urls"
import { adminContestsQuery } from "./useAdminContests"

type AdminStartLeadSeniorWatsonSelectionParams = {
  contestID: number
  force: boolean
}

export const useAdminStartLeadSeniorWatsonSelection = () => {
  const queryClient = useQueryClient()
  const { mutate, mutateAsync, ...mutation } = useMutation<void, Error, AdminStartLeadSeniorWatsonSelectionParams>(
    async (params) => {
      await contestsAPI.post(adminStartLeadSeniorWatsonSelectionUrl(), {
        contest_id: params.contestID,
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
    startLeadSeniorWatsonSelection: mutate,
    ...mutation,
  }
}
