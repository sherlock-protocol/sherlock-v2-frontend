import { useMutation } from "react-query"
import { adminPublishReport } from "../urls"
import { contests as contestsAPI } from "../axios"

type AdminPublishReportParams = {
  contestID: number
}

export const useAdminPublishReport = () => {
  const { mutate, mutateAsync, ...mutation } = useMutation<void, Error, AdminPublishReportParams>(async (params) => {
    await contestsAPI.post(
      adminPublishReport(params.contestID),
      {},
      {
        timeout: 5 * 60 * 1000,
      }
    )
  })

  return {
    publishReport: mutate,
    ...mutation,
  }
}
