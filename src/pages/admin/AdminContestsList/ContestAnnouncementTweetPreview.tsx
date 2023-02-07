import TweetCard from "react-tweet-card"
import { useAdminContestTweetPreview } from "../../../hooks/api/admin/useAdminContestTweetPreview"

type Props = {
  contestID: number
}

export const ContestAnnouncementTweetPreview: React.FC<Props> = ({ contestID }) => {
  const { data: tweet } = useAdminContestTweetPreview(contestID)

  return (
    <TweetCard
      author={{
        name: "Sherlock",
        username: "sherlockdefi",
        image: "https://pbs.twimg.com/profile_images/1436392128649646080/JbU4oAP1_400x400.jpg",
      }}
      tweet={tweet ?? ""}
      time={new Date()}
    />
  )
}
