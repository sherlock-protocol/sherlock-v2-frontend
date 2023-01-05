import { useQuery } from "react-query"
import { Address } from "wagmi"
import { contests as contestsAPI } from "../axios"
import { getAdminProfile } from "../urls"

type GetAdminProfileResponse = {
  admin: Address
}

export const useAdminProfile = () =>
  useQuery("isAdmin", async () => {
    const { data } = await contestsAPI.get<GetAdminProfileResponse>(getAdminProfile())

    return data.admin
  })
