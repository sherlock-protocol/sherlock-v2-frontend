import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"
import { validateDiscordHandle as validateDiscordHandleUrl } from "../urls"

type ValidateDiscordHandleResponse = {
  handle: string
  discriminator: string
  user_id: number
}

type DiscordHandleValidation = {
  handle: string
  discriminator: string
  userID: number
}

export const validateDiscordHandleKey = (handle: string) => ["validate-discord", handle]
export const useValidateDiscordHandle = (handle?: string) =>
  useQuery<DiscordHandleValidation, Error>(
    validateDiscordHandleKey(handle ?? ""),
    async () => {
      const { data } = await contestsAPI.get<ValidateDiscordHandleResponse>(validateDiscordHandleUrl(handle ?? ""))

      return {
        handle: data.handle,
        discriminator: data.discriminator,
        userID: data.user_id,
      }
    },
    {
      enabled: !!handle,
    }
  )
