import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"
import { getProtocolDashboard as getProtocolDashboardUrl } from "../urls"

export type Payment = {
  txHash: string
  amount: number
}

export type ContestDetails = {
  id: number
  title: string
  logoURL: string
  startDate: number
  endDate: number
  prizePool: number
  leadSeniorAuditorHandle: string
}

type PaymentsDetails = {
  totalAmount: number
  totalPaid: number
  payments: Payment[]
}

type DashboardInfo = {
  contest: ContestDetails
  payments: PaymentsDetails
}

type PaymentsResponse = {
  contest: {
    id: number
    title: string
    logo_url: string
    starts_at: number
    ends_at: number
    prize_pool: number
    lead_senior_auditor_handle: string
    full_payment: number
  }
  payments: {
    tx_hash: string
    amount: number
  }[]
}

export const protocolDashboardQuery = (id: string) => ["protocol-dashboard", id]
export const useProtocolDashboard = (dashboardID: string) =>
  useQuery<DashboardInfo, Error>(protocolDashboardQuery(dashboardID), async () => {
    const { data } = await contestsAPI.get<PaymentsResponse>(getProtocolDashboardUrl(dashboardID))

    return {
      contest: {
        id: data.contest.id,
        title: data.contest.title,
        logoURL: data.contest.logo_url,
        startDate: data.contest.starts_at,
        endDate: data.contest.ends_at,
        prizePool: data.contest.prize_pool,
        leadSeniorAuditorHandle: data.contest.lead_senior_auditor_handle,
      },
      payments: {
        totalAmount: data.contest.full_payment,
        totalPaid: data.payments.reduce((t, p) => t + p.amount, 0),
        payments: data.payments.map((p) => ({
          txHash: p.tx_hash,
          amount: p.amount,
        })),
      },
    }
  })
