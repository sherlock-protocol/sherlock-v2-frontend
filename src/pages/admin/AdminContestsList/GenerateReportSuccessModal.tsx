import { report } from "process"
import { useCallback } from "react"
import { FaDownload, FaFileDownload, FaGithub, FaRecycle } from "react-icons/fa"
import { Button } from "../../../components/Button"
import { Column, Row } from "../../../components/Layout"
import Modal, { Props as ModalProps } from "../../../components/Modal/Modal"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { ContestsListItem } from "../../../hooks/api/admin/useAdminContests"

import styles from "./AdminContestsList.module.scss"

type Props = ModalProps & {
  contest: ContestsListItem
  report?: string
}

export const GenerateReportSuccessModal: React.FC<Props> = ({ contest, report, ...props }) => {
  const handleDownloadClick = useCallback(() => {
    report && window.open(report)
  }, [report])

  const handleRegenerateClick = useCallback(() => {
    props.onClose?.()
  }, [props])

  return (
    <Modal closeable {...props}>
      <Column spacing="l">
        <Column alignment={["center", "start"]} spacing="m">
          <Title variant="h2">AUDIT REPORT</Title>
          <img src={contest.logoURL} className={styles.logoBg} alt={contest.title} />
          <Title variant="h2">{contest.title}</Title>
        </Column>
        <Column spacing="xl">
          <Column spacing="s">
            <Button onClick={handleDownloadClick}>
              <FaFileDownload />
              &nbsp;Download
            </Button>
            <Button>
              <FaGithub />
              &nbsp;Publish
            </Button>
          </Column>
          <Button variant="alternate" onClick={handleRegenerateClick}>
            <FaRecycle />
            &nbsp;Re-generate
          </Button>
          <Button variant="secondary" onClick={props.onClose}>
            Close
          </Button>
        </Column>
      </Column>
    </Modal>
  )
}
