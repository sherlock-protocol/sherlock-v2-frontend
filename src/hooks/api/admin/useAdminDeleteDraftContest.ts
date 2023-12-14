import { useMutation } from "wagmi"
import { adminDeleteDraftContest as adminDeleteDraftContestUrl } from "../urls"
import { contests as contestsAPI } from "../axios"
import { useQueryClient } from "react-query"
import { adminContestsQuery } from "./useAdminContests"

type AdminDeleteDraftContestParams = {
  contestID: number
}

export const useAdminDeleteDraftContest = () => {
  const queryClient = useQueryClient()

  const { mutate, mutateAsync, ...mutation } = useMutation<void, Error, AdminDeleteDraftContestParams>(
    async (params) => {
      await contestsAPI.delete(adminDeleteDraftContestUrl(params.contestID))
    },
    {
      async onSettled(data, error, params) {
        await queryClient.invalidateQueries(adminContestsQuery("draft"))
      },
    }
  )

  return {
    deleteContest: mutate,
    ...mutation,
  }
}
