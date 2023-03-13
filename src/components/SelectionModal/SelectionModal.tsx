import { Button } from "../Button"
import { Column } from "../Layout"
import Modal, { Props as ModalProps } from "../Modal/Modal"
import { Text } from "../Text"
import { Title } from "../Title"

export type Props<T> = ModalProps & {
  title: string
  description?: React.ReactNode
  options: T[]
  onChange: (option: T) => void
  selectedOption?: T
  isLoading?: boolean
  loadingLabel?: string
  className?: string
}

export const SelectionModal = <T extends React.ReactNode>({
  title,
  description,
  options,
  onChange,
  selectedOption,
  onClose,
  isLoading = false,
  loadingLabel = "Loading ...",
  className,
}: Props<T>) => {
  return (
    <Modal closeable onClose={onClose}>
      <Column spacing="m" className={className}>
        <Title>{title}</Title>
        {description}
        {isLoading && <Text variant="secondary">{loadingLabel}</Text>}
        <Column spacing="s">
          {options.map((option, index) => (
            <Button
              key={`option-${index}`}
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
