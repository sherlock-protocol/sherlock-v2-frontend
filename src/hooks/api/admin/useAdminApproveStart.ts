import { useMutation, useQueryClient } from "react-query"
import { adminApproveStart as adminApproveStartUrl } from "../urls"
import { contests as contestsAPI } from "../axios"
import { adminContestsQuery } from "./useAdminContests"

type AdminApproveStartParams = {
  contestID: number
}

export const useAdminApproveStart = () => {
  const queryClient = useQueryClient()
  const { mutate, mutateAsync, ...mutation } = useMutation<void, Error, AdminApproveStartParams>(
    async (params) => {
      await contestsAPI.post(adminApproveStartUrl(), {
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
