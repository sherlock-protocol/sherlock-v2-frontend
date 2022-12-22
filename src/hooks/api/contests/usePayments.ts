import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"
import { getContestPayments as getContestPaymentsUrl } from "../urls"

type PaymentsInfo = {
  totalAmount: number
  totalPaid: number
  payments: {
    txHash: string
    amount: number
  }[]
}

type PaymentsResponse = {
  full_payment: number
  payments: {
    tx_hash: string
    amount: number
  }[]
}

export const contestPaymentsQuery = (id: number) => ["contest-payment", id]
export const usePayments = (contestID: number) =>
  useQuery<PaymentsInfo, Error>(contestPaymentsQuery(contestID), async () => {
    const { data } = await contestsAPI.get<PaymentsResponse>(getContestPaymentsUrl(contestID))

    return {
      totalAmount: data.full_payment,
      totalPaid: data.payments.reduce((t, p) => t + p.amount, 0),
      payments: data.payments.map((p) => ({
        txHash: p.tx_hash,
        amount: p.amount,
      })),
    }
  })
