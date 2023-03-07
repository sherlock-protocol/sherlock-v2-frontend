import { AxiosError } from "axios"
import { useMutation, useQueryClient } from "react-query"
import { contests as contestsAPI } from "../axios"
import { protocolDashboardQuery } from "../contests/useProtocolDashboard"
import { addProtocolDiscordHandle as addProtocolDiscordHandleUrl } from "../urls"
import { protocolDiscordHandlesQuery } from "./useDiscordHandles"

type AddDiscordHandleParams = {
  protocolDashboardID: string
  handle: string
}

export const useAddDiscordHandle = () => {
  const queryClient = useQueryClient()

  const { mutate: addDiscordHandle, ...mutation } = useMutation<null, Error, AddDiscordHandleParams>(
    async (params) => {
      try {
        await contestsAPI.post(addProtocolDiscordHandleUrl(params.protocolDashboardID), {
          discord_handle: params.handle,
        })
      } catch (error) {
        const axiosError = error as AxiosError
        throw Error(axiosError.response?.data.error ?? "Something went wrong. Please, try again.")
      }

      return null
    },
    {
      async onSuccess(data, params) {
        await queryClient.invalidateQueries(protocolDiscordHandlesQuery(params.protocolDashboardID))
        await queryClient.invalidateQueries(protocolDashboardQuery(params.protocolDashboardID))
      },
    }
  )

  return {
    addDiscordHandle,
    ...mutation,
  }
}
