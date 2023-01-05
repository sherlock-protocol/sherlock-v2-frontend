import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"
import { validateDiscordHandle as validateDiscordHandleUrl } from "../urls"

type ValidateDiscordHandleResponse = {
  validated_handle: string
}

export const validateDiscordHandleKey = (handle: string) => ["validate-discord", handle]
export const useValidateDiscordHandle = (handle?: string) =>
  useQuery(
    validateDiscordHandleKey(handle ?? ""),
    async () => {
      const { data } = await contestsAPI.get<ValidateDiscordHandleResponse>(validateDiscordHandleUrl(handle ?? ""))

      return data.validated_handle
    },
    {
      enabled: !!handle,
    }
  )
