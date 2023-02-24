import { useQuery } from "react-query"
import { getAdminProtocol as getAdminProtocolUrl } from "../urls"
import { contests as contestsAPI } from "../axios"

type AdminGetProtocolResponse = {
  protocol: {
    id: number
    logo_url: string
    github_team: string
    twitter: string
    website: string
  }
}

type ProtocolInfo = {
  id: number
  logoURL: string
  githubTeam: string
  twitter: string
  website: string
}

export const adminProtocolQuery = (name: string) => ["admin-protocol", name]
export const useAdminProtocol = (name?: string) =>
  useQuery<ProtocolInfo | undefined>(
    adminProtocolQuery(name ?? ""),
    async () => {
      const { data } = await contestsAPI.get<AdminGetProtocolResponse>(getAdminProtocolUrl(name ?? ""))

      return {
        id: data.protocol.id,
        logoURL: data.protocol.logo_url,
        githubTeam: data.protocol.github_team,
        twitter: data.protocol.twitter,
        website: data.protocol.website,
      }
    },
    {
      enabled: !!name,
    }
  )
