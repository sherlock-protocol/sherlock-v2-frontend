import React from "react"

import { Modal, Props as ModalProps } from "../../components/Modal/Modal"
import { Text } from "../../components/Text"

type Props = ModalProps

export const NewClaimModal: React.FC<Props> = (props) => {
  return (
    <Modal {...props}>
      <Text>Create new claim</Text>
    </Modal>
  )
}
