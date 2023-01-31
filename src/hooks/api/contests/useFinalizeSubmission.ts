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
      await contestsAPI.post(
        finalizeSubmissionUrl(params.dashboardID),
        {},
        {
          timeout: 5 * 60 * 1000,
        }
      )
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
