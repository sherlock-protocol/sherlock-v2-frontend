import axios, { AxiosError } from "axios"
import { useQuery } from "react-query"

type GithubResponse = {
  type: string
}

export const validateGithubHandleKey = (handle: string) => ["validate-github", handle]
export const useValidateGithubHandle = (handle: string) =>
  useQuery(
    validateGithubHandleKey(handle),
    async () => {
      try {
        const { data } = await axios.get<GithubResponse>(`https://api.github.com/users/${handle}`)

        return data.type === "User"
      } catch (error) {
        const axiosError = error as AxiosError

        if (
          axiosError.response?.headers["x-ratelimit-remaining"] &&
          parseInt(axiosError.response.headers["x-ratelimit-remaining"]) === 0
        ) {
          return true
        } else {
          return false
        }
      }
    },
    {
      enabled: handle !== "",
    }
  )
