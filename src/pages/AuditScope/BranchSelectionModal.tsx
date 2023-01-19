import { SelectionModal } from "../../components/SelectionModal/SelectionModal"
import { useRepository } from "../../hooks/api/scope/useRepository"
import { Props as ModalProps } from "../../components/Modal/Modal"
import { Text } from "../../components/Text"
import { FaGithub } from "react-icons/fa"
import { Row } from "../../components/Layout"

export type Props = ModalProps & {
  repoName: string
  selectedBranch?: string
  onSelectBranch: (branch: string) => void
}

export const BranchSelectionModal: React.FC<Props> = ({ repoName, selectedBranch, onSelectBranch, onClose }) => {
  const { data: repo } = useRepository(repoName)

  return (
    <SelectionModal
      title="Select branch"
      description={
        <Row spacing="xs">
          <FaGithub />
          <Text strong>{repoName}</Text>
        </Row>
      }
      selectedOption={selectedBranch}
      options={repo?.branches.map((b) => b.name) ?? []}
      onChange={onSelectBranch}
      onClose={onClose}
    />
  )
}
