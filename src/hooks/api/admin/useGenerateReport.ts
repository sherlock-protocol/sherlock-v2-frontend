import { useMutation } from "react-query"
import { adminGenerateReport } from "../urls"
import { contests as contestsAPI } from "../axios"

type AdminGenerateReportParams = {
  contestID: number
}

export const useAdminGenerateReport = () => {
  const { mutate, mutateAsync, ...mutation } = useMutation<void, Error, AdminGenerateReportParams>(async (params) => {
    await contestsAPI.post(adminGenerateReport(params.contestID))
  })

  return {
    generateReport: mutate,
    ...mutation,
  }
}
