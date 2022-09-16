import { AxiosError } from "axios"
import { useMemo } from "react"
import { useMutation, useQueryClient } from "react-query"
import { useAccount } from "wagmi"

import { contests as contestsAPI } from "../axios"
import { contestantQueryKey } from "../contests"
import { contestSignUp as contestSignUpUrl } from "../urls"

type SignUp = {
  repo: string
}

type SignUpResponseData = {
  repo_name: string
}

class SignUpError extends Error {
  fieldErrors?: Record<string, string[]>

  constructor(reason?: string | Record<string, string[]>) {
    super(typeof reason === "string" ? reason : "")

    if (typeof reason === "object") {
      this.fieldErrors = reason
    }
  }
}

type SignUpVariables = {
  contestId: number
  signature: string
  handle: string
  githubHandle: string
  discordHandle: string
  twitterHandle?: string
  telegramHandle?: string
}

function sanitizeString(value?: string) {
  if (!value) return value

  const trimValue = value.trim()

  if (trimValue.length > 0) return trimValue

  return
}

export const useContestSignUp = () => {
  const queryClient = useQueryClient()
  const { address } = useAccount()

  const { mutate: signUp, ...mutation } = useMutation<SignUp, SignUpError, SignUpVariables>(
    async (args) => {
      try {
        const { data } = await contestsAPI.post<SignUpResponseData>(contestSignUpUrl(), {
          handle: args.handle,
          github_handle: args.githubHandle,
          discord_handle: sanitizeString(args.discordHandle),
          twitter_handle: sanitizeString(args.twitterHandle),
          telegram_handle: sanitizeString(args.telegramHandle),
          contest_id: args.contestId,
          signature: args.signature,
          address,
        })

        return {
          repo: data.repo_name,
        }
      } catch (error) {
        const axiosError = error as AxiosError
        throw new SignUpError(axiosError.response?.data)
      }
    },
    {
      onSettled(_data, _error, variables, _context) {
        queryClient.invalidateQueries(contestantQueryKey(address ?? "", variables.contestId))
      },
    }
  )

  return useMemo(
    () => ({
      signUp,
      ...mutation,
    }),
    [signUp, mutation]
  )
}
