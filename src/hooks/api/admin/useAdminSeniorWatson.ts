import { AxiosError } from "axios"
import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"

import { getSeniorWatson as getSeniorWatsonUrl } from "../urls"

type SeniorWatson = {
  id: number
  handle: string
}

type GetSeniorWatsonResponse = {
  senior_watson: {
    id: number
    handle: string
  }
}

const seniorWatsonKey = (handle: string) => ["senior_watson", handle]
export const useAdminSeniorWatson = (handle: string) =>
  useQuery<SeniorWatson, Error>(
    seniorWatsonKey(handle),
    async () => {
      try {
        const { data } = await contestsAPI.get<GetSeniorWatsonResponse>(getSeniorWatsonUrl(handle))

        return {
          id: data.senior_watson.id,
          handle: data.senior_watson.handle,
        }
      } catch (error) {
        const axiosError = error as AxiosError
        throw Error(axiosError.response?.data.error ?? "Something went wrong. Please, try again.")
      }
    },
    {
      enabled: handle !== "",
    }
  )
