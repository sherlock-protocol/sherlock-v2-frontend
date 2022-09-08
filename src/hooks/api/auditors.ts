import { useQuery } from "react-query"
import { contests as contestsAPI } from "./axios"
import { getIsAuditor as getIsAuditorUrl } from "./urls"

export type Auditor = {
  id: number
  handle: string
  discordHandle?: string
  githubHandle?: string
  twitterHandle?: string
  telegramHandle?: string
}

type GetIsAuditorResponseData = {
  is_auditor: boolean
}

export const isAuditorQuery = (address?: string) => ["isAuditor", address]
export const useIsAuditor = (address?: string) =>
  useQuery<boolean, Error>(
    isAuditorQuery(address),
    async () => {
      const { data } = await contestsAPI.get<GetIsAuditorResponseData>(getIsAuditorUrl(address ?? ""))

      return data.is_auditor
    },
    { enabled: address !== undefined }
  )
