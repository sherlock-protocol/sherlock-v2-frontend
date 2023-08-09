import { useCallback, useMemo, useState } from "react"
import { FaCaretDown, FaCaretRight, FaCheckCircle, FaFile, FaFolder, FaRegFile } from "react-icons/fa"
import cx from "classnames"
import { Column, Row } from "../../components/Layout"
import { Text } from "../../components/Text"
import { Entry, getAllTreePaths, RootDirectory } from "../../hooks/api/scope/useRepositoryContracts"

import styles from "./AuditScope.module.scss"
import { Button } from "../../components/Button"
import { Scope } from "../../hooks/api/scope/useScope"

type Props = {
  tree: RootDirectory
  selectedPaths: string[]
  onPathSelected: (paths: string[]) => void
  onClearSelection: () => void
  onSelectAll: () => void
  initialScope?: Scope
}

type TreeEntryProps = {
  name: string
  parentPath?: string
  tree: Entry
  onToggleCollapse?: (paths: string) => void
  collapsedEntries?: string[]
  initialScope?: Scope
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
  initialScope,
}) => {
  const handleFileClick = useCallback(
    (paths: string[]) => {
      tree.type === "file" ? onPathSelected?.(paths.map((p) => `${parentPath}/${p}`)) : onPathSelected?.(paths)
    },
    [parentPath, onPathSelected, tree]
  )

  const allSubPaths = useMemo(
    () => getAllTreePaths(`${parentPath}${parentPath && "/"}${name}`, tree),
    [parentPath, tree, name]
  )
  const allSelected = useMemo(() => allSubPaths.every((p) => selectedPaths.includes(p)), [allSubPaths, selectedPaths])
  const allInInitialScope = useMemo(
    () => initialScope?.files.filter((f) => f.selected).map((f) => f.filePath) ?? [],
    [initialScope]
  )

  const isCollapsed = collapsedEntries.includes(`${parentPath}/${name}`)

  if (tree.type === "file") {
    const selected = selectedPaths.includes(parentPath !== "" ? `${parentPath}/${tree.name}` : tree.name)
    const initialScopeFile = initialScope?.files.find((f) => f.filePath === tree.filepath && f.selected)
    const diffWithInitialScope =
      initialScopeFile && initialScopeFile.nSLOC && tree.nsloc && tree.nsloc - initialScopeFile.nSLOC

    return (
      <li className={cx(styles.file, { [styles.selected]: selected })} onClick={() => handleFileClick([tree.name])}>
        <Row alignment="space-between">
          <Row spacing="xs">
            <Text className={styles.icon}>{selected ? <FaFile /> : <FaRegFile />}</Text>
            <Text>{tree.name}</Text>
          </Row>
          <Row spacing="s">
            <Text variant="secondary" size="small" className={cx({ [styles.addedNSLOC]: !initialScopeFile })}>
              {`${!initialScopeFile ? "+ " : ""} ${tree.nsloc}`}
            </Text>
            {diffWithInitialScope !== undefined ? (
              <Text
                variant="secondary"
                size="small"
                className={cx({ [styles.addedNSLOC]: diffWithInitialScope > 0 })}
              >{`(${diffWithInitialScope > 0 ? "+" : ""}${
                diffWithInitialScope === 0 ? "-" : diffWithInitialScope
              })`}</Text>
            ) : null}

            <Text className={styles.icon}>
              <FaCheckCircle style={{ opacity: selected ? 1 : 0 }} />
            </Text>
          </Row>
        </Row>
      </li>
    )
  }

  const entryElements: React.ReactNode[] = []

  tree.entries.forEach((value, key) => {
    entryElements.push(
      <TreeEntry
        key={key}
        name={value.name}
        tree={value}
        onPathSelected={handleFileClick}
        parentPath={`${parentPath ? `${parentPath}/` : ""}${name}`}
        selectedPaths={selectedPaths}
        onToggleCollapse={onToggleCollapse}
        collapsedEntries={collapsedEntries}
        initialScope={initialScope}
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
  tree,
  selectedPaths = [],
  onPathSelected,
  onClearSelection,
  onSelectAll,
  initialScope,
}) => {
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

  tree.entries.forEach((value, key) => {
    treeElements.push(
      <TreeEntry
        key={key}
        name={value.name}
        tree={value}
        onPathSelected={onPathSelected}
        selectedPaths={selectedPaths}
        onToggleCollapse={handleToggleCollapse}
        collapsedEntries={collapsedEntries}
        initialScope={initialScope}
      />
    )
  })

  return (
    <Column spacing="s" className={styles.tree}>
      <Row alignment={["start", "center"]} spacing="s">
        <Button
          // variant={selectedPaths.length === data?.rawPaths.length ? "primary" : "secondary"}
          size="small"
          onClick={() => onSelectAll()}
        >
          Select all
        </Button>
        <Button variant="secondary" size="small" onClick={onClearSelection}>
          Clear selection
        </Button>
      </Row>
      <Row alignment="space-between">
        <Text size="small" strong>
          Files
        </Text>
        <Row spacing="s">
          <Text size="small" strong>
            nSLOC
          </Text>
          <Text size="small">(Diff.)</Text>
          <FaCheckCircle style={{ opacity: 0 }} />
        </Row>
      </Row>
      <ul className={styles.directoryList}>{treeElements}</ul>
    </Column>
  )
}
