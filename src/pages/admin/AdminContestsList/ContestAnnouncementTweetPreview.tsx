import TweetCard from "react-tweet-card"
import { Column } from "../../../components/Layout"
import { useAdminContestTweetPreview } from "../../../hooks/api/admin/useAdminContestTweetPreview"

type Props = {
  contestID: number
}

export const ContestAnnouncementTweetPreview: React.FC<Props> = ({ contestID }) => {
  const { data: tweets } = useAdminContestTweetPreview(contestID)

  return (
    <Column alignment="center" spacing="m">
      {tweets?.map((t) => (
        <TweetCard
          author={{
            name: "Sherlock",
            username: "sherlockdefi",
            image: "https://pbs.twimg.com/profile_images/1436392128649646080/JbU4oAP1_400x400.jpg",
          }}
          tweet={t ?? ""}
          time={new Date()}
        />
      ))}
    </Column>
  )
}
