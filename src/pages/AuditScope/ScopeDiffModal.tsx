import Modal, { Props as ModalProps } from "../../components/Modal/Modal"

type Props = ModalProps & {}

export const ScopeDiffModal: React.FC<Props> = ({ onClose }) => {
  return <Modal onClose={onClose}></Modal>
}
