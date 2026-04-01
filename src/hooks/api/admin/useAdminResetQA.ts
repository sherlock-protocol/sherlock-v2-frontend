import { useMutation } from "react-query"
import { adminResetQA as adminResetQAUrl } from "../urls"
import { contests as contestsAPI } from "../axios"
import { useQueryClient } from "react-query"
import { adminContestQuery } from "./useAdminContest"

type AdminResetQAParams = {
  contestID: number
}

export const useAdminResetQA = () => {
  const queryClient = useQueryClient()

  const { mutate, ...mutation } = useMutation<void, Error, AdminResetQAParams>(
    async (params) => {
      await contestsAPI.post(adminResetQAUrl(params.contestID))
    },
    {
      async onSettled(data, error, params) {
        await queryClient.invalidateQueries(adminContestQuery(params.contestID))
      },
    }
  )

  return {
    resetQA: mutate,
    ...mutation,
  }
}
