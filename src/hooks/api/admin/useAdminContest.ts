import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"
import { getAdminContest as getAdminContestUrl } from "../urls"
import { ContestsListItem, GetAdminContestsResponse, parseContest } from "./useAdminContests"

type AdminContestResponse = {
  contest: GetAdminContestsResponse & {
    nsloc?: number
    expected_nsloc?: number
    context_questions_ready?: boolean
  }
}

type AdminContest = ContestsListItem & {
  nSLOC?: number
  expectedNSLOC?: number
  contextQuestionsReady?: boolean
}

export const adminContestQuery = (contestID: number) => ["admin-contest", contestID]
export const useAdminContest = (contestID: number) =>
  useQuery<AdminContest, Error>(adminContestQuery(contestID), async () => {
    const { data } = await contestsAPI.get<AdminContestResponse>(getAdminContestUrl(contestID))

    return {
      ...parseContest(data.contest),
      nSLOC: data.contest.nsloc,
      expectedNSLOC: data.contest.expected_nsloc,
      contextQuestionsReady: data.contest.context_questions_ready,
    }
  })
