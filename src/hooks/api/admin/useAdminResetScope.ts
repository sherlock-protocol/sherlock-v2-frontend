import { useMutation } from "wagmi"
import { adminResetScope as adminResetScopeUrl } from "../urls"
import { contests as contestsAPI } from "../axios"

type AdminResetScopeParams = {
  contestID: number
}

export const useAdminResetScope = () => {
  const { mutate, mutateAsync, ...mutation } = useMutation<void, Error, AdminResetScopeParams>(async (params) => {
    await contestsAPI.delete(adminResetScopeUrl(params.contestID))
  })

  return {
    resetScope: mutate,
    ...mutation,
  }
}
