import { FaTelegram } from "react-icons/fa"
import { Text } from "../../../components/Text"
import { ContestsListItem } from "../../../hooks/api/admin/useAdminContests"

import styles from "./AdminContestsList.module.scss"

type Props = {
  contest: Pick<ContestsListItem, "telegramChat">
}

export const TelegramBotIndicator: React.FC<Props> = ({ contest }) => {
  return (
    <Text size="small" className={styles.telegram} variant={contest.telegramChat ? "success" : "warning"}>
      <FaTelegram /> {contest.telegramChat ? "Linked to telegram group" : "Telegram bot not added"}
    </Text>
  )
}
