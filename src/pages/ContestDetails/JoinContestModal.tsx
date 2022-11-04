import { FaUsers } from "react-icons/fa"
import { Button } from "../../components/Button"
import { Column, Row } from "../../components/Layout"
import { Modal, Props as ModalProps } from "../../components/Modal/Modal"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { AuditorProfile } from "../../hooks/api/auditors/index"
import { Contest } from "../../hooks/api/contests"

type Props = ModalProps & {
  contest: Contest
  auditor: AuditorProfile
  onSelectHandle: (handle: string) => void
}

export const JoinContestModal: React.FC<Props> = ({ onClose, onSelectHandle, contest, auditor }) => {
  return (
    <Modal closeable onClose={onClose}>
      <Column alignment="stretch" spacing="l">
        <Column alignment="center" spacing="l">
          <Row>
            <img src={contest.logoURL} width={80} height={80} alt={contest.title} />
          </Row>
          <Title>{`Join ${contest.title} contest`}</Title>
          <Text>You can compete in this contest individually, or as a team.</Text>
          <Text>Select one of the options below:</Text>
        </Column>
        <Row>
          <Column alignment="center" spacing="s" grow={1}>
            <Button onClick={() => onSelectHandle(auditor.handle)} variant="secondary" fullWidth>
              {auditor.handle}
            </Button>
            {auditor.managedTeams.map((t) => (
              <Button onClick={() => onSelectHandle(t.handle)} variant="secondary" fullWidth>
                <Row alignment={["center", "center"]} spacing="s">
                  <FaUsers /> <Text>{t.handle}</Text>
                </Row>
              </Button>
            ))}
          </Column>
        </Row>
      </Column>
    </Modal>
  )
}
