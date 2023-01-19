import { SelectionModal } from "../../components/SelectionModal/SelectionModal"
import { Props as ModalProps } from "../../components/Modal/Modal"
import { Text } from "../../components/Text"
import { FaGithub } from "react-icons/fa"
import { Row } from "../../components/Layout"
import { useRepositoryCommits } from "../../hooks/api/scope/useRepositoryCommits"

export type Props = ModalProps & {
  repoName: string
  branchName: string
  selectedCommit?: string
  onSelectCommit: (commit: string) => void
}

export const CommitSelectionModal: React.FC<Props> = ({
  repoName,
  branchName,
  selectedCommit,
  onSelectCommit,
  onClose,
}) => {
  const { data: commits } = useRepositoryCommits(repoName, branchName)

  return (
    <SelectionModal
      title="Select commit hash"
      description={
        <Row spacing="xs">
          <FaGithub />
          <Text strong>{repoName}</Text>
        </Row>
      }
      selectedOption={selectedCommit}
      options={commits ?? []}
      onChange={onSelectCommit}
      onClose={onClose}
    />
  )
}
