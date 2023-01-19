import { useCallback, useEffect } from "react"
import { FaCheckCircle, FaFile, FaFolder, FaRegFile } from "react-icons/fa"
import cx from "classnames"
import { Column, Row } from "../../components/Layout"
import { Text } from "../../components/Text"
import { TreeValue, useRepositoryContracts } from "../../hooks/api/scope/useRepositoryContracts"

import styles from "./AuditScope.module.scss"

type Props = {
  repo: string
  commit: string
  selectedPaths: string[]
  onPathSelected: (path: string) => void
  onLoadPaths: (paths: string[]) => void
}

type TreeEntryProps = {
  name: string
  parentPath?: string
  tree: TreeValue
  selectedPaths: string[]
  onPathSelected: (path: string) => void
}

const TreeEntry: React.FC<TreeEntryProps> = ({ name, tree, parentPath = "", onPathSelected, selectedPaths = [] }) => {
  const handleFileClick = useCallback(
    (path: string) => {
      typeof tree === "string" ? onPathSelected(path) : onPathSelected(`${name}/${path}`)
    },
    [name, onPathSelected, tree]
  )

  if (typeof tree === "string") {
    const selected = selectedPaths.includes(`${parentPath}/${tree}`)
    return (
      <li className={cx(styles.file, { [styles.selected]: selected })} onClick={() => handleFileClick(tree)}>
        <Row alignment="space-between">
          <Row spacing="xs">
            <Text className={styles.icon}>{selected ? <FaFile /> : <FaRegFile />}</Text>
            <Text>{tree}</Text>
          </Row>
          {selected && (
            <Text className={styles.icon}>
              <FaCheckCircle />
            </Text>
          )}
        </Row>
      </li>
    )
  }

  const entryElements: React.ReactNode[] = []

  tree.forEach((value, key) => {
    entryElements.push(
      <TreeEntry
        key={key}
        name={key}
        tree={value}
        onPathSelected={handleFileClick}
        parentPath={`${parentPath ? `${parentPath}/` : ""}${name}`}
        selectedPaths={selectedPaths}
      />
    )
  })

  return (
    <li className={styles.folder}>
      <Row spacing="xs">
        <Text>
          <FaFolder />
        </Text>
        <Text variant="secondary">{name}</Text>
      </Row>
      {entryElements.length > 0 ? <ul>{entryElements}</ul> : null}
    </li>
  )
}

export const RepositoryContractsSelector: React.FC<Props> = ({
  repo,
  commit,
  selectedPaths = [],
  onPathSelected,
  onLoadPaths,
}) => {
  const { data, isSuccess } = useRepositoryContracts(repo, commit)

  useEffect(() => {
    if (isSuccess) {
      onLoadPaths(data.rawPaths)
    }
  }, [isSuccess, data])

  const treeElements: React.ReactNode[] = []

  data?.tree.forEach((value, key) => {
    treeElements.push(
      <TreeEntry key={key} name={key} tree={value} onPathSelected={onPathSelected} selectedPaths={selectedPaths} />
    )
  })

  if (treeElements.length === 0) {
    return (
      <Row alignment="center">
        <Text variant="secondary">No Solidity contracts found</Text>
      </Row>
    )
  }

  return (
    <Column spacing="s" className={styles.tree}>
      <ul className={styles.directoryList}>{treeElements}</ul>
    </Column>
  )
}
