import { useMutation, useQueryClient } from "react-query"
import { adminGenerateReport } from "../urls"
import { contests as contestsAPI } from "../axios"
import { adminContestsQuery } from "./useAdminContests"

type AdminGenerateReportParams = {
  contestID: number
}

type GenerateReportResponse = {
  report: string
}

export const useAdminGenerateReport = () => {
  const queryClient = useQueryClient()

  const { mutate, mutateAsync, ...mutation } = useMutation<string, Error, AdminGenerateReportParams>(
    async (params) => {
      const { data } = await contestsAPI.post<GenerateReportResponse>(
        adminGenerateReport(params.contestID),
        {},
        {
          timeout: 5 * 60 * 1000,
        }
      )

      return data.report
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(adminContestsQuery("finished"))
      },
    }
  )

  return {
    generateReport: mutate,
    ...mutation,
  }
}
