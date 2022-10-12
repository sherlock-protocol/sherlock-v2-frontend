import { FaInfoCircle } from "react-icons/fa"
import { AuditorForm, AuditorFormValues } from "../../components/AuditorForm/AuditorForm"
import { Column, Row } from "../../components/Layout"
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer"
import { Modal, Props as ModalProps } from "../../components/Modal/Modal"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"

import styles from "./Contests.module.scss"

type Props = ModalProps & {
  onSubmit: (values: AuditorFormValues) => void
  isLoading?: boolean
}

export const AuditorSignUpModal: React.FC<Props> = ({ onSubmit, isLoading = false, ...props }) => {
  return (
    <Modal {...props}>
      <LoadingContainer loading={isLoading} label="Loading ...">
        <Column spacing="l" className={styles.formContainer}>
          <Title>SIGN UP</Title>
          <Row className={styles.c4Banner}>
            <Column spacing="s">
              <Row>
                <FaInfoCircle />
                &nbsp;
                <Title variant="h3">IMPORTANT</Title>
              </Row>
              <Text>To claim a C4 handle, you need to authenticate using the address associated with it.</Text>
            </Column>
          </Row>
          <AuditorForm onSubmit={onSubmit} />
        </Column>
      </LoadingContainer>
    </Modal>
  )
}
