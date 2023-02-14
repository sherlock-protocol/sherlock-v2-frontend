import { AxiosError } from "axios"
import { useMutation, useQueryClient } from "react-query"
import { contests as contestsAPI } from "../axios"
import { submitScope as submitScopeUrl } from "../urls"
import { protocolDashboardQuery } from "./useProtocolDashboard"

type SubmitScopeParams = {
  dashboardID: string
}

export const useSubmitScope = () => {
  const queryClient = useQueryClient()

  const {
    mutate: submitScope,
    mutateAsync,
    ...mutation
  } = useMutation<void, Error, SubmitScopeParams>(
    async (params) => {
      try {
        await contestsAPI.post(
          submitScopeUrl(params.dashboardID),
          {},
          {
            timeout: 5 * 60 * 1000,
          }
        )
      } catch (error) {
        const axiosError = error as AxiosError
        throw Error(axiosError.response?.data.error ?? "Something went wrong. Please, try again.")
      }
    },
    {
      onSuccess(data, params) {
        queryClient.invalidateQueries(protocolDashboardQuery(params.dashboardID))
      },
    }
  )

  return {
    submitScope,
    ...mutation,
  }
}
