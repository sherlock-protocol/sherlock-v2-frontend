import TweetCard from "react-tweet-card"
import { Column, Row } from "../../../components/Layout"
import { useAdminContestTweetPreview } from "../../../hooks/api/admin/useAdminContestTweetPreview"

type Props = {
  contestID: number
}

export const ContestAnnouncementTweetPreview: React.FC<Props> = ({ contestID }) => {
  const { data: tweets } = useAdminContestTweetPreview(contestID)

  return (
    <Column spacing="s" alignment="center">
      {tweets?.map((tweet) => (
        <TweetCard
          fitInsideContainer
          author={{
            name: "Sherlock",
            username: "sherlockdefi",
            image: "https://pbs.twimg.com/profile_images/1436392128649646080/JbU4oAP1_400x400.jpg",
          }}
          tweet={tweet ?? ""}
          time={new Date()}
        />
      ))}
    </Column>
  )
}
