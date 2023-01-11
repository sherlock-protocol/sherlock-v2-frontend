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
  adminApproved: boolean
  dashboardID: string
}

type GetAdminContestsResponse = {
  id: number
  title: string
  logo_url: string
  status: ContestStatus
  initial_payment_complete: boolean
  full_payment_complete: boolean
  admin_approved: boolean
  dashboard_id: string
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
      adminApproved: d.admin_approved,
      dashboardID: d.dashboard_id,
    }))
  })
