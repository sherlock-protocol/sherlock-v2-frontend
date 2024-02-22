import { FaTelegram } from "react-icons/fa"
import { Column } from "../../../components/Layout"
import { Text } from "../../../components/Text"
import { Tooltip, TooltipTrigger, TooltipContent } from "../../../components/Tooltip/Tooltip"
import { ContestsListItem } from "../../../hooks/api/admin/useAdminContests"

import styles from "./AdminContestsList.module.scss"

type Props = {
  contest: Pick<ContestsListItem, "telegramChat">
}

export const TelegramBotIndicator: React.FC<Props> = ({ contest }) => {
  return contest.telegramChat ? (
    <Text size="small" className={styles.telegram} variant="success">
      <FaTelegram /> Linked to telegram group
    </Text>
  ) : (
    <Tooltip>
      <TooltipTrigger>
        <Text size="small" className={styles.telegram} variant="warning">
          <FaTelegram /> Telegram bot not added
        </Text>
      </TooltipTrigger>
      <TooltipContent>
        {contest.telegramChat ? null : (
          <Column spacing="s">
            <Text strong size="small">
              To link this contest with a Telegram group chat:
            </Text>
            <Text size="small">1. add https://t.me/sherlockdefibot to the protocol's telegram chat</Text>
            <Text size="small">2. send a link to the dashboard in the chat</Text>
            <Text size="small">After that, it will be automatically linked.</Text>
          </Column>
        )}
      </TooltipContent>
    </Tooltip>
  )
}
