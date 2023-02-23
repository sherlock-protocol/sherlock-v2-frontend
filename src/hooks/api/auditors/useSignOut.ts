import { useMutation, useQueryClient } from "react-query"
import { adminProfileQuery } from "../admin/useAdminProfile"
import { profileQuery } from "../auditors/useProfile"
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
        queryClient.setQueryData(adminProfileQuery(), undefined)
      },
    }
  )

  return {
    signOut,
    ...mutation,
  }
}
