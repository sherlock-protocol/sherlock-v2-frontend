import { useMutation, useQueryClient } from "react-query"
import { adminApproveStart as adminApproveStartUrl } from "../urls"
import { contests as contestsAPI } from "../axios"
import { adminContestsQuery } from "./useAdminContests"

type AdminApproveStartParams = {
  contestID: number
  force: boolean
}

export const useAdminApproveStart = () => {
  const queryClient = useQueryClient()
  const { mutate, mutateAsync, ...mutation } = useMutation<void, Error, AdminApproveStartParams>(
    async (params) => {
      await contestsAPI.post(adminApproveStartUrl(), {
        contest_id: params.contestID,
        force: params.force,
      })
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(adminContestsQuery("active"))
      },
    }
  )

  return {
    approve: mutate,
    ...mutation,
  }
}
