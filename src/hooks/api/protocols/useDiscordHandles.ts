import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"
import { getProtocolDiscordHandles as getProtocolDiscordHandlesUrl } from "../urls"

type DiscordMember = {
  handle: string
  discriminator: number
}

type GetDiscordHandlesResponse = {
  discord_members: {
    handle: string
    discriminator: number
  }[]
}

export const protocolDiscordHandlesQuery = (dashboardID: string) => ["protocol-discord-handles", dashboardID]
export const useDiscordHandles = (dashboardID?: string) =>
  useQuery<DiscordMember[], Error>(
    protocolDiscordHandlesQuery(dashboardID ?? ""),
    async () => {
      const { data } = await contestsAPI.get<GetDiscordHandlesResponse>(getProtocolDiscordHandlesUrl(dashboardID ?? ""))

      return data.discord_members.map((d) => ({
        handle: d.handle,
        discriminator: d.discriminator,
      }))
    },
    {
      enabled: !!dashboardID,
    }
  )
