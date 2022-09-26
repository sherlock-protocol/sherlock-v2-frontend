import { useMutation, useQueryClient } from "react-query"
import { profileQuery } from "../auditors"
import { contests as contestsAPI } from "../axios"
import { signOut as signOutUrl } from "../urls"

export const useSignOut = () => {
  const queryClient = useQueryClient()
  const {
    mutate: signOut,
    mutateAsync,
    ...mutation
  } = useMutation(
    async () => {
      await contestsAPI.get(signOutUrl())
    },
    {
      onSuccess() {
        queryClient.setQueryData(profileQuery(), undefined)
      },
    }
  )

  return {
    signOut,
    ...mutation,
  }
}
