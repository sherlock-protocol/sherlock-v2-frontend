import { useMutation, useQueryClient } from "react-query"
import { AuditorProfile } from "."
import { AuditorResponseData, parseAuditorResponse, profileQuery } from "./useProfile"
import { contests as contestsAPI } from "../axios"
import { submitDepositTransaction as submitDepositTransactionUrl } from "../urls"

type SubmitDepositTransactionResponseData = {
  auditor: AuditorResponseData
}

type SubmitDepositTransactionParams = {
  transactionHash: string
}

export const useSubmitDepositTransaction = () => {
  const queryClient = useQueryClient()

  const {
    mutate: submitDepositTransaction,
    mutateAsync,
    ...mutation
  } = useMutation<AuditorProfile, Error, SubmitDepositTransactionParams>(
    async (params) => {
      const { data } = await contestsAPI.post<SubmitDepositTransactionResponseData>(submitDepositTransactionUrl(), {
        transaction_hash: params.transactionHash,
      })

      return parseAuditorResponse(data.auditor)
    },
    {
      onSuccess: async (auditorProfile) => {
        await queryClient.invalidateQueries(profileQuery())
      },
    }
  )

  return {
    submitDepositTransaction,
    ...mutation,
  }
}
