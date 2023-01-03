import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"
import { getProtocolDiscordHandles as getProtocolDiscordHandlesUrl } from "../urls"

type DiscordHandles = string[]

type GetDiscordHandlesResponse = {
  discord_handles: string[]
}

export const protocolDiscordHandlesQuery = (dashboardID: string) => ["protocol-discord-handles", dashboardID]
export const useDiscordHandles = (dashboardID?: string) =>
  useQuery<DiscordHandles, Error>(
    protocolDiscordHandlesQuery(dashboardID ?? ""),
    async () => {
      const { data } = await contestsAPI.get<GetDiscordHandlesResponse>(getProtocolDiscordHandlesUrl(dashboardID ?? ""))

      return data.discord_handles
    },
    {
      enabled: !!dashboardID,
    }
  )
