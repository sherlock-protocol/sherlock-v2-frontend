import { useMutation, useQueryClient } from "react-query"
import { submitPayment as submitPaymentUrl } from "../urls"
import { contests as contestsAPI } from "../axios"
import { contestPaymentsQuery } from "./usePayments"

type SubmitPaymentParams = {
  contestID: number
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
        contest_id: params.contestID,
        tx_hash: params.txHash,
      })

      return null
    },
    {
      onSuccess(data, params) {
        console.log("HEREEEEEE")
        queryClient.invalidateQueries(contestPaymentsQuery(params.contestID))
      },
    }
  )

  return {
    submitPayment,
    ...mutation,
  }
}
