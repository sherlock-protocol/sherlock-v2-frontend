import { useCallback } from "react"
import { Button } from "../../../components/Button"
import { Column } from "../../../components/Layout"
import Modal, { Props as ModalProps } from "../../../components/Modal/Modal"
import { Title } from "../../../components/Title"
import { FaDownload } from "react-icons/fa"

type Props = ModalProps & {
  reportURL: string
}

export const SaveScopeSuccessModal: React.FC<Props> = ({ reportURL, ...props }) => {
  const handleDownloadClick = useCallback(() => {
    window.open(reportURL, "blank")
  }, [reportURL])

  return (
    <Modal closeable {...props}>
      <Column spacing="m">
        <Title variant="h2">Scope saved</Title>
        <Button onClick={handleDownloadClick}>
          Download report&nbsp;
          <FaDownload />
        </Button>
      </Column>
    </Modal>
  )
}
