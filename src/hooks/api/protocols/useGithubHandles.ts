import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"
import { getProtocolGithubHandles as getProtocolGithubHandlesUrl } from "../urls"

export type GithubTeamMember = {
  handle: string
  pendingInvite: boolean
}

type GithubHandlesResponse = {
  members: {
    handle: string
    pending_invite: boolean
  }[]
}

export const protocolGithubHandlesQuery = (id: string) => ["protocol-github-handles", id]
export const useGithubHandles = (dashboardID?: string) =>
  useQuery<GithubTeamMember[], Error>(
    protocolGithubHandlesQuery(dashboardID ?? ""),
    async () => {
      const { data } = await contestsAPI.get<GithubHandlesResponse>(getProtocolGithubHandlesUrl(dashboardID ?? ""))

      return data.members.map((m) => ({
        handle: m.handle,
        pendingInvite: m.pending_invite,
      }))
    },
    {
      enabled: !!dashboardID,
    }
  )
