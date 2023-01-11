import { useMutation, useQueryClient } from "react-query"
import { adminApproveContest as adminApproveContestUrl } from "../urls"
import { contests as contestsAPI } from "../axios"
import { adminContestsQuery } from "./useAdminContests"

type AdminApproveContestParams = {
  contestID: number
}

export const useAdminApproveContest = () => {
  const queryClient = useQueryClient()
  const { mutate, mutateAsync, ...mutation } = useMutation<void, Error, AdminApproveContestParams>(
    async (params) => {
      await contestsAPI.post(adminApproveContestUrl(), {
        contest_id: params.contestID,
      })
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(adminContestsQuery())
      },
    }
  )

  return {
    approve: mutate,
    ...mutation,
  }
}
