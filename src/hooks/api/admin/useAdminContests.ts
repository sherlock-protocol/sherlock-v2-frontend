import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"

import { getAdminContests as getAdminContestsUrl } from "../urls"

export type ContestStatus = "CREATED" | "RUNNING" | "JUDGING" | "FINISHED" | "ESCALATING" | "SHERLOCK_JUDGING"

export type ContestsListItem = {
  id: number
  title: string
  shortDescription: string
  logoURL: string
  status: ContestStatus
  initialPayment: boolean
  fullPaymentComplete: boolean
  adminUpcomingApproved: boolean
  adminStartApproved: boolean
  dashboardID?: string
  startDate: number
  endDate: number
  submissionReady: boolean
  hasSolidityMetricsReport: boolean
  leadSeniorAuditorHandle: string
  leadSeniorSelectionMessageSentAt: number
  leadSeniorConfirmationMessage: string
  auditReport?: string
  linesOfCode?: string
  rewards: number
  judgingPrizePool: number
  leadJudgeFixedPay: number
  fullPayment: number
}

type GetAdminContestsResponse = {
  id: number
  title: string
  short_description: string
  logo_url: string
  status: ContestStatus
  initial_payment_complete: boolean
  full_payment_complete: boolean
  admin_upcoming_approved: boolean
  admin_start_approved: boolean
  dashboard_id: string
  starts_at: number
  ends_at: number
  protocol_submission_ready: boolean
  has_solidity_metrics_report: boolean
  lead_senior_auditor_handle: string
  senior_selection_message_sent_at: number
  senior_confirmed_message: string
  audit_report?: string
  lines_of_code?: string
  audit_rewards: number
  judging_prize_pool: number
  lead_judge_fixed_pay: number
  full_payment: number
}[]

export type ContestListStatus = "active" | "finished"

export const adminContestsQuery = (status: ContestListStatus) => ["admin-contests", status]
export const useAdminContests = (status: ContestListStatus) =>
  useQuery<ContestsListItem[], Error>(adminContestsQuery(status), async () => {
    const { data } = await contestsAPI.get<GetAdminContestsResponse>(getAdminContestsUrl(status))

    return data.map((d) => ({
      id: d.id,
      title: d.title,
      shortDescription: d.short_description,
      logoURL: d.logo_url,
      status: d.status,
      initialPayment: d.initial_payment_complete,
      fullPaymentComplete: d.full_payment_complete,
      adminUpcomingApproved: d.admin_upcoming_approved,
      adminStartApproved: d.admin_start_approved,
      dashboardID: d.dashboard_id,
      startDate: d.starts_at,
      endDate: d.ends_at,
      submissionReady: d.protocol_submission_ready,
      hasSolidityMetricsReport: d.has_solidity_metrics_report,
      leadSeniorAuditorHandle: d.lead_senior_auditor_handle,
      leadSeniorSelectionMessageSentAt: d.senior_selection_message_sent_at,
      leadSeniorConfirmationMessage: d.senior_confirmed_message,
      auditReport: d.audit_report,
      linesOfCode: d.lines_of_code,
      rewards: d.audit_rewards,
      judgingPrizePool: d.judging_prize_pool,
      leadJudgeFixedPay: d.lead_judge_fixed_pay,
      fullPayment: d.full_payment,
    }))
  })
