import { AuditorForm, AuditorFormValues } from "../../components/AuditorForm/AuditorForm"
import { Column } from "../../components/Layout"
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer"
import { Modal, Props as ModalProps } from "../../components/Modal/Modal"
import { Title } from "../../components/Title"

type Props = ModalProps & {
  onSubmit: (values: AuditorFormValues) => void
  isLoading?: boolean
}

export const AuditorSignUpModal: React.FC<Props> = ({ onSubmit, isLoading = false, ...props }) => {
  return (
    <Modal {...props}>
      <LoadingContainer loading={isLoading} label="Check your wallet. You need to sign a message ...">
        <Column spacing="l">
          <Title>SIGN UP</Title>
          <AuditorForm onSubmit={onSubmit} />
        </Column>
      </LoadingContainer>
    </Modal>
  )
}
