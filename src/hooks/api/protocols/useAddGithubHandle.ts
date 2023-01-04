import { AxiosError } from "axios"
import { useMutation, useQueryClient } from "react-query"
import { contests as contestsAPI } from "../axios"
import { addProtocolGithubHandle as addProtocolGithubHandleUrl } from "../urls"
import { protocolGithubHandlesQuery } from "./useGithubHandles"

type AddGithubHandleParams = {
  protocolDashboardID: string
  handle: string
}

export const useAddGithubHandle = () => {
  const queryClient = useQueryClient()

  const { mutate: addGithubHandle, ...mutation } = useMutation<null, Error, AddGithubHandleParams>(
    async (params) => {
      try {
        await contestsAPI.post(addProtocolGithubHandleUrl(params.protocolDashboardID), {
          github_handle: params.handle,
        })
      } catch (error) {
        const axiosError = error as AxiosError
        throw Error(axiosError.response?.data.error ?? "Something went wrong. Please, try again.")
      }

      return null
    },
    {
      async onSuccess(data, params) {
        await queryClient.invalidateQueries(protocolGithubHandlesQuery(params.protocolDashboardID))
      },
    }
  )

  return {
    addGithubHandle,
    ...mutation,
  }
}
