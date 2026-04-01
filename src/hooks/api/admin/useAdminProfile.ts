import { useQuery } from "react-query"
import type { Address } from "viem"
import { contests as contestsAPI } from "../axios"
import { getAdminProfile } from "../urls"

type GetAdminProfileResponse = {
  admin: Address
}

export const adminProfileQuery = () => "isAdmin"
export const useAdminProfile = () =>
  useQuery(adminProfileQuery(), async () => {
    try {
      const { data } = await contestsAPI.get<GetAdminProfileResponse>(getAdminProfile())
      return data.admin
    } catch (error) {
      return undefined
    }
  })
