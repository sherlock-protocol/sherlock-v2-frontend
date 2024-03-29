import { Column, Row } from "../../../components/Layout"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { ContestsListItem } from "../../../hooks/api/admin/useAdminContests"

import styles from "./AdminContestsList.module.scss"

type Props = {
  title: string
  contest: ContestsListItem
}

export const AdminActionHeader: React.FC<Props> = ({ contest, title }) => {
  return (
    <Column alignment={["center", "start"]} spacing="xs">
      <Title variant="h2">{title}</Title>
      <Row spacing="s" alignment={["center", "center"]}>
        <img src={contest.logoURL} className={styles.logo} alt={contest.title} />
        <Text strong>{contest.title}</Text>
      </Row>
    </Column>
  )
}
