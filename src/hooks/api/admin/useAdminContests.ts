import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"

import { getAdminContests as getAdminContestsUrl } from "../urls"

export type ContestStatus = "CREATED" | "RUNNING" | "JUDGING" | "FINISHED" | "ESCALATING" | "SHERLOCK_JUDGING"

export type ContestsListItem = {
  id: number
  title: string
  logoURL: string
  status: ContestStatus
  initialPayment: boolean
  fullPayment: boolean
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
}

type GetAdminContestsResponse = {
  id: number
  title: string
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
}[]

export const adminContestsQuery = () => "admin-contests"
export const useAdminContests = () =>
  useQuery<ContestsListItem[], Error>(adminContestsQuery(), async () => {
    const { data } = await contestsAPI.get<GetAdminContestsResponse>(getAdminContestsUrl())

    return data.map((d) => ({
      id: d.id,
      title: d.title,
      logoURL: d.logo_url,
      status: d.status,
      initialPayment: d.initial_payment_complete,
      fullPayment: d.full_payment_complete,
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
    }))
  })
