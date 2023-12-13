import { useMutation } from "wagmi"
import { adminResetScope as adminResetScopeUrl } from "../urls"
import { contests as contestsAPI } from "../axios"
import { useQueryClient } from "react-query"
import { adminContestsQuery } from "./useAdminContests"

type AdminResetScopeParams = {
  contestID: number
  scopeType: "initial" | "final"
}

export const useAdminResetScope = () => {
  const queryClient = useQueryClient()

  const { mutate, mutateAsync, ...mutation } = useMutation<void, Error, AdminResetScopeParams>(
    async (params) => {
      await contestsAPI.delete(adminResetScopeUrl(params.contestID, params.scopeType))
    },
    {
      async onSettled(data, error, params) {
        await queryClient.invalidateQueries(adminContestsQuery(params.scopeType === "initial" ? "draft" : "active"))
      },
    }
  )

  return {
    resetScope: mutate,
    ...mutation,
  }
}
