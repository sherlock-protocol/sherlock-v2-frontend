import { useCallback } from "react"
import { Button } from "../../../components/Button"
import { Column } from "../../../components/Layout"
import Modal, { Props as ModalProps } from "../../../components/Modal/Modal"
import { Title } from "../../../components/Title"
import { FaDownload } from "react-icons/fa"
import { Text } from "../../../components/Text"

type Props = ModalProps & {}

export const ScopeErrorModal: React.FC<Props> = (props) => {
  return (
    <Modal closeable {...props}>
      <Column spacing="m">
        <Title variant="h2">Solidity metrics failed</Title>
        <Text>There was an error analyzing the scope. Try again.</Text>
        <Button onClick={() => props.onClose?.()}>Ok</Button>
      </Column>
    </Modal>
  )
}
