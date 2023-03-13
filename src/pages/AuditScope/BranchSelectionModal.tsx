import { SelectionModal } from "../../components/SelectionModal/SelectionModal"
import { useRepository } from "../../hooks/api/scope/useRepository"
import { Props as ModalProps } from "../../components/Modal/Modal"
import { Text } from "../../components/Text"
import { FaGithub } from "react-icons/fa"
import { Row } from "../../components/Layout"
import { useCallback } from "react"

export type Props = ModalProps & {
  repoName: string
  selectedBranch?: string
  onSelectBranch: (branch: string, commitHash: string) => void
}

export const BranchSelectionModal: React.FC<Props> = ({ repoName, selectedBranch, onSelectBranch, onClose }) => {
  const { data: repo, isLoading } = useRepository(repoName)

  const handleSelectBranch = useCallback(
    (branchName: string) => {
      const branch = repo?.branches.find((b) => b.name === branchName)

      if (branch) {
        onSelectBranch(branch.name, branch.commit)
      }
    },
    [onSelectBranch, repo]
  )

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
      onChange={handleSelectBranch}
      onClose={onClose}
      isLoading={isLoading}
      loadingLabel="Loading branches ..."
    />
  )
}
