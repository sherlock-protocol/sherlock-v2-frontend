import { AxiosError } from "axios"
import { useMutation, useQueryClient } from "react-query"
import { contests as contestsAPI } from "../axios"
import { finalizeSubmission as finalizeSubmissionUrl } from "../urls"
import { protocolDashboardQuery } from "./useProtocolDashboard"

type FinalizeSubmissionParams = {
  dashboardID: string
}

export const useFinalizeSubmission = () => {
  const queryClient = useQueryClient()

  const {
    mutate: finalizeSubmission,
    mutateAsync,
    ...mutation
  } = useMutation<void, Error, FinalizeSubmissionParams>(
    async (params) => {
      try {
        await contestsAPI.post(finalizeSubmissionUrl(params.dashboardID), {})
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
    finalizeSubmission,
    ...mutation,
  }
}
