import { DateTime } from "luxon"
import TweetCard from "react-tweet-card"
import { commify } from "../../../utils/units"

type Contest = {
  id: number
  title: string
  twitterHandle?: string
  rewards: number
  linesOfCode?: string
  leadSeniorWatsonHandle?: string
  startDate: number
}

type Props = {
  contest: Contest
}

export const ContestAnnouncementTweetPreview: React.FC<Props> = ({ contest }) => {
  const formattedStartDate = DateTime.fromSeconds(contest.startDate).toFormat("EEEE, MMMM d 'at' T 'UTC'")

  return (
    <TweetCard
      author={{
        name: "Sherlock",
        username: "sherlockdefi",
        image: "https://pbs.twimg.com/profile_images/1436392128649646080/JbU4oAP1_400x400.jpg",
      }}
      tweet={`
      🚨 New contest: ${contest.title} ${contest.twitterHandle ? `@${contest.twitterHandle}` : ""} 🚨 \n
      Sign up here: https://app.sherlock.xyz/audits/contests/${contest.id} \n
      Total Rewards: ${commify(contest.rewards)} USDC \n
      nSLOC: ${contest.linesOfCode} \n
      Lead Senior Watson: ${contest.leadSeniorWatsonHandle ?? "TBD"} \n
      \n
      Starts ${formattedStartDate}\n
      \n
      Check it out!!`}
      time={new Date()}
    />
  )
}
