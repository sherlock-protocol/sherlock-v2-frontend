import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"
import { GetAdminContestsResponse, parseContest } from "./useAdminContests"
import { getAdminProtocolContests } from "../urls"

export const adminProtocolContestsKey = (protocolID: number) => ["protocol-last-contest", protocolID]
export const useAdminProtocolContests = (protocolID: number | undefined) =>
  useQuery(
    adminProtocolContestsKey(protocolID ?? -1),
    async () => {
      const { data } = await contestsAPI.get<GetAdminContestsResponse[]>(getAdminProtocolContests(protocolID ?? -1))

      if (!data) {
        return null
      }

      return data?.map(parseContest)
    },
    {
      enabled: !!protocolID,
    }
  )
