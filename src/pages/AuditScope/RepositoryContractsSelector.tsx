import { useCallback, useMemo, useState } from "react"
import { FaCaretDown, FaCaretRight, FaCheckCircle, FaFile, FaFolder, FaRegFile } from "react-icons/fa"
import cx from "classnames"
import { Column, Row } from "../../components/Layout"
import { Text } from "../../components/Text"
import { getAllTreePaths, TreeValue, useRepositoryContracts } from "../../hooks/api/scope/useRepositoryContracts"

import styles from "./AuditScope.module.scss"
import { Button } from "../../components/Button"

type Props = {
  repo: string
  commit: string
  selectedPaths: string[]
  onPathSelected: (paths: string[]) => void
  onClearSelection: () => void
  onSelectAll: (files: string[]) => void
}

type TreeEntryProps = {
  name: string
  parentPath?: string
  tree: TreeValue
  onToggleCollapse?: (paths: string) => void
  collapsedEntries?: string[]
} & (
  | { selectedPaths: string[]; onPathSelected: (path: string[]) => void; readOnly?: false }
  | {
      selectedPaths?: never
      onPathSelected?: never
      readOnly: true
    }
)

export const TreeEntry: React.FC<TreeEntryProps> = ({
  name,
  tree,
  parentPath = "",
  onPathSelected,
  onToggleCollapse,
  collapsedEntries = [],
  selectedPaths = [],
  readOnly = false,
}) => {
  const handleFileClick = useCallback(
    (paths: string[]) => {
      typeof tree === "string" ? onPathSelected?.(paths.map((p) => `${parentPath}/${p}`)) : onPathSelected?.(paths)
    },
    [parentPath, onPathSelected, tree]
  )

  const allSubPaths = useMemo(
    () => getAllTreePaths(`${parentPath}${parentPath && "/"}${name}`, tree),
    [parentPath, tree, name]
  )
  const allSelected = useMemo(() => allSubPaths.every((p) => selectedPaths.includes(p)), [allSubPaths, selectedPaths])

  const isCollapsed = collapsedEntries.includes(`${parentPath}/${name}`)

  if (typeof tree === "string") {
    const selected = selectedPaths.includes(parentPath !== "" ? `${parentPath}/${tree}` : tree)
    return (
      <li className={cx(styles.file, { [styles.selected]: selected })} onClick={() => handleFileClick([tree])}>
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
        onToggleCollapse={onToggleCollapse}
        collapsedEntries={collapsedEntries}
      />
    )
  })

  return (
    <li className={cx(styles.folder, { [styles.selected]: allSelected })}>
      <Row spacing="xs">
        <Text>
          <FaFolder className={styles.clickable} onClick={() => onPathSelected?.(allSubPaths)} />
        </Text>
        <Text variant="secondary">{name}</Text>
        {isCollapsed ? (
          <FaCaretRight onClick={() => onToggleCollapse?.(`${parentPath}/${name}`)} className={styles.clickable} />
        ) : (
          <FaCaretDown onClick={() => onToggleCollapse?.(`${parentPath}/${name}`)} className={styles.clickable} />
        )}
      </Row>
      {entryElements.length > 0 && !isCollapsed ? <ul>{entryElements}</ul> : null}
    </li>
  )
}

export const RepositoryContractsSelector: React.FC<Props> = ({
  repo,
  commit,
  selectedPaths = [],
  onPathSelected,
  onClearSelection,
  onSelectAll,
}) => {
  const { data, isLoading } = useRepositoryContracts(repo, commit)
  const [collapsedEntries, setCollapsedEntries] = useState<string[]>([])

  const handleToggleCollapse = useCallback((path: string) => {
    setCollapsedEntries((entries) => {
      if (entries.includes(path)) {
        return entries.filter((e) => e !== path)
      } else {
        return [...entries, path]
      }
    })
  }, [])

  const treeElements: React.ReactNode[] = []

  data?.tree.forEach((value, key) => {
    treeElements.push(
      <TreeEntry
        key={key}
        name={key}
        tree={value}
        onPathSelected={onPathSelected}
        selectedPaths={selectedPaths}
        onToggleCollapse={handleToggleCollapse}
        collapsedEntries={collapsedEntries}
      />
    )
  })

  if (isLoading) {
    return (
      <Row alignment="center">
        <Text variant="secondary">Loading contracts ...</Text>
      </Row>
    )
  }

  if (treeElements.length === 0 && !isLoading) {
    return (
      <Row alignment="center">
        <Text variant="secondary">No Solidity contracts found</Text>
      </Row>
    )
  }

  return (
    <Column spacing="s" className={styles.tree}>
      <Row alignment={["end", "center"]} spacing="s">
        <Text variant="secondary" size="small">
          {selectedPaths.length > 0 ? selectedPaths.length : "No"}&nbsp;
          {`contract${selectedPaths.length === 1 ? "" : "s"} selected`}
        </Text>
        <Button
          variant={selectedPaths.length === data?.rawPaths.length ? "primary" : "secondary"}
          size="small"
          onClick={() => onSelectAll(data?.rawPaths ?? [])}
        >
          Select all
        </Button>
        <Button variant="secondary" size="small" onClick={onClearSelection}>
          Clear selection
        </Button>
      </Row>
      <ul className={styles.directoryList}>{treeElements}</ul>
    </Column>
  )
}
