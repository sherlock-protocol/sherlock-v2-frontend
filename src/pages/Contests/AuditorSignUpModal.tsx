import { useCallback, useEffect, useState } from "react"
import { FaInfoCircle } from "react-icons/fa"
import { AuditorForm, AuditorFormValues } from "../../components/AuditorForm/AuditorForm"
import { Column, Row } from "../../components/Layout"
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer"
import { Modal, Props as ModalProps } from "../../components/Modal/Modal"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { useSignUp } from "../../hooks/api/auditors/useSignUp"
import { ErrorModal } from "../ContestDetails/ErrorModal"

import styles from "./Contests.module.scss"
import { SignUpSuccessModal } from "./SignUpSuccessModal"

type Props = ModalProps

export const AuditorSignUpModal: React.FC<Props> = (props) => {
  const { signUp, isLoading, isSuccess, isError, error, reset, auditor } = useSignUp()
  const [signUpSuccessModalOpen, setSignUpSuccessModalOpen] = useState(false)
  const [signUpErrorModalOpen, setSignUpErrorModalOpen] = useState(false)

  useEffect(() => {
    if (isSuccess) {
      setSignUpSuccessModalOpen(true)
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError && error) {
      console.log(error)
      setSignUpErrorModalOpen(true)
    }
  }, [isError, error, setSignUpErrorModalOpen])

  const handleSubmit = useCallback(
    (values: AuditorFormValues) => {
      signUp(values)
    },
    [signUp]
  )

  const handleErrorModalClose = useCallback(() => {
    setSignUpErrorModalOpen(false)
    reset()
  }, [setSignUpErrorModalOpen, reset])

  const handleSuccessModalClose = useCallback(() => {
    setSignUpSuccessModalOpen(false)
    props.onClose && props.onClose()
  }, [setSignUpSuccessModalOpen, props])

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
          <AuditorForm onSubmit={handleSubmit} />
        </Column>
      </LoadingContainer>
      {signUpSuccessModalOpen && auditor && <SignUpSuccessModal auditor={auditor} onClose={handleSuccessModalClose} />}
      {signUpErrorModalOpen && (
        <ErrorModal reason={error?.fieldErrors ?? error?.message} onClose={handleErrorModalClose} />
      )}
    </Modal>
  )
}
