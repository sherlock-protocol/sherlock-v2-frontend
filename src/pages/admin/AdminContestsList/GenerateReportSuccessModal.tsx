import { useCallback } from "react"
import { FaFileDownload, FaGithub, FaRecycle } from "react-icons/fa"
import { Button } from "../../../components/Button"
import { Column } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import Modal, { Props as ModalProps } from "../../../components/Modal/Modal"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { ContestsListItem } from "../../../hooks/api/admin/useAdminContests"
import { useAdminPublishReport } from "../../../hooks/api/admin/usePublishReport"

import styles from "./AdminContestsList.module.scss"

type Props = ModalProps & {
  contest: ContestsListItem
  report?: string
}

export const GenerateReportSuccessModal: React.FC<Props> = ({ contest, report, ...props }) => {
  const { publishReport, isLoading: publishReportIsLoading, isSuccess: publishReportSuccess } = useAdminPublishReport()

  const handleDownloadClick = useCallback(() => {
    report && window.open(report)
  }, [report])

  const handlePublishClick = useCallback(() => {
    publishReport({
      contestID: contest.id,
    })
  }, [contest, publishReport])

  const handleRegenerateClick = useCallback(() => {
    props.onClose?.()
  }, [props])

  return (
    <Modal closeable {...props}>
      <LoadingContainer loading={publishReportIsLoading} label="Loading ...">
        <Column spacing="l">
          <Column alignment={["center", "start"]} spacing="m">
            <Title variant="h2">AUDIT REPORT</Title>
            <img src={contest.logoURL} className={styles.logoBg} alt={contest.title} />
            <Title variant="h2">{contest.title}</Title>
          </Column>
          {publishReportSuccess ? <Text alignment="center">Audit report was uploaded to Judging Repo</Text> : null}
          <Column spacing="xl">
            <Column spacing="s">
              <Button onClick={handleDownloadClick}>
                <FaFileDownload />
                &nbsp;Download
              </Button>
              <Button onClick={handlePublishClick}>
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
      </LoadingContainer>
    </Modal>
  )
}
