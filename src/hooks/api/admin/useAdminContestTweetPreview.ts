import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"
import { getAdminContestTweetPreview as getAdminContestTweetPreviewUrl } from "../urls"

export const adminContestTweetPreviewKey = (contestID: number) => ["contest-tweet-preview", contestID]
export const useAdminContestTweetPreview = (contestID: number) =>
  useQuery<string[], Error>(adminContestTweetPreviewKey(contestID), async () => {
    const { data } = await contestsAPI.get<{ tweets: string[] }>(getAdminContestTweetPreviewUrl(contestID))

    return data.tweets
  })
