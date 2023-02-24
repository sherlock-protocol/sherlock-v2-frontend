import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"
import { getAdminTwitterAccount as getAdminTwitterAccountUrl } from "../urls"

type TwitterAccount = {
  username: string
  profilePictureURL: string
}

type AdminTwitterAccountResponse = {
  username: string
  profile_image_url: string
}

export const adminTwitterAccountKey = (handle: string) => ["twitter-account", handle]
export const useAdminTwitterAccount = (handle: string) =>
  useQuery(
    adminTwitterAccountKey(handle),
    async () => {
      const { data } = await contestsAPI.get<AdminTwitterAccountResponse>(getAdminTwitterAccountUrl(handle))

      return {
        username: data.username,
        profilePictureUrl: data.profile_image_url,
      }
    },
    {
      enabled: handle !== "",
    }
  )
