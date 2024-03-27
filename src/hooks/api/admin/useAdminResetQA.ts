import { useMutation } from "wagmi"
import { adminResetQA as adminResetQAUrl } from "../urls"
import { contests as contestsAPI } from "../axios"
import { useQueryClient } from "react-query"
import { adminContestsQuery } from "./useAdminContests"
import { adminContestQuery } from "./useAdminContest"

type AdminResetQAParams = {
  contestID: number
}

export const useAdminResetQA = () => {
  const queryClient = useQueryClient()

  const { mutate, mutateAsync, ...mutation } = useMutation<void, Error, AdminResetQAParams>(
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
