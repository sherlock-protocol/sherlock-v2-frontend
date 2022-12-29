import { useMutation, useQueryClient } from "react-query"
import { submitPayment as submitPaymentUrl } from "../urls"
import { contests as contestsAPI } from "../axios"
import { protocolDashboardQuery } from "./useProtocolDashboard"
import { AxiosError } from "axios"

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
      try {
        await contestsAPI.post(submitPaymentUrl(), {
          dashboard_id: params.protocolDashboardID,
          tx_hash: params.txHash,
        })
      } catch (error) {
        const axiosError = error as AxiosError
        throw Error(axiosError.response?.data.error ?? "Something went wrong. Please, try again.")
      }
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
