import { Button } from "../../../components/Button"
import { Column, Row } from "../../../components/Layout"
import Modal, { Props as ModalProps } from "../../../components/Modal/Modal"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { ContestsListItem } from "../../../hooks/api/admin/useAdminContests"

import styles from "./AdminContestsList.module.scss"

type Props = ModalProps & {
  contest: ContestsListItem
}

export const GenerateReportSuccessModal: React.FC<Props> = ({ contest, ...props }) => {
  return (
    <Modal closeable {...props}>
      <Column spacing="l">
        <Column alignment={["center", "start"]} spacing="m">
          <Title variant="h1">Audit Report Generated</Title>
          <Row spacing="s" alignment={["center", "center"]}>
            <img src={contest.logoURL} className={styles.logo} alt={contest.title} />
            <Text strong>{contest.title}</Text>
          </Row>
        </Column>
        <Text>The audit report has been generated and sent to Discord</Text>
        <Button onClick={props.onClose}>OK</Button>
      </Column>
    </Modal>
  )
}
