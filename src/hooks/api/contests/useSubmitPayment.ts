import { useMutation, useQueryClient } from "react-query"
import { submitPayment as submitPaymentUrl } from "../urls"
import { contests as contestsAPI } from "../axios"
import { protocolDashboardQuery } from "./useProtocolDashboard"

type SubmitPaymentParams = {
  protocolDashboardID: string
  txHash: string
}

export const useSubmitPayment = () => {
  const queryClient = useQueryClient()

  const {
    mutate: submitPayment,
    mutateAsync,
    ...mutation
  } = useMutation<null, Error, SubmitPaymentParams>(
    async (params) => {
      await contestsAPI.post(submitPaymentUrl(), {
        dashboard_id: params.protocolDashboardID,
        tx_hash: params.txHash,
      })

      return null
    },
    {
      onSuccess(data, params) {
        queryClient.invalidateQueries(protocolDashboardQuery(params.protocolDashboardID))
      },
    }
  )

  return {
    submitPayment,
    ...mutation,
  }
}
