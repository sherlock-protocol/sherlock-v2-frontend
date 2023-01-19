import { Button } from "../Button"
import { Column } from "../Layout"
import Modal, { Props as ModalProps } from "../Modal/Modal"
import { Title } from "../Title"

export type Props<T> = ModalProps & {
  title: string
  description?: React.ReactNode
  options: T[]
  onChange: (option: T) => void
  selectedOption?: T
}

export const SelectionModal = <T extends React.ReactNode>({
  title,
  description,
  options,
  onChange,
  selectedOption,
  onClose,
}: Props<T>) => {
  return (
    <Modal closeable onClose={onClose}>
      <Column spacing="m">
        <Title>{title}</Title>
        {description}
        <Column spacing="s">
          {options.map((option) => (
            <Button
              variant={option === selectedOption ? "alternate" : "secondary"}
              size="small"
              onClick={() => onChange(option)}
            >
              {option}
            </Button>
          ))}
        </Column>
      </Column>
    </Modal>
  )
}
