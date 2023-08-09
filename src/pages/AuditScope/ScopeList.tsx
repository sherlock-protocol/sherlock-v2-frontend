import { FaGithub } from "react-icons/fa"
import { Box } from "../../components/Box"
import { Column } from "../../components/Layout"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { convertToTree2 } from "../../hooks/api/scope/useRepositoryContracts"
import { Scope } from "../../hooks/api/scope/useScope"
import { TreeEntry } from "./RepositoryContractsSelector"

import styles from "./AuditScope.module.scss"

type Props = {
  scope: Scope[]
}

export const ScopeList: React.FC<Props> = ({ scope }) => {
  return (
    <Column>
      {scope?.map((s) => {
        const tree = convertToTree2(
          s.files.map((f) => ({
            filepath: f.filePath,
            nsloc: f.nSLOC ?? 0,
          })) ?? []
        )
        const treeElements: React.ReactNode[] = []

        tree.entries.forEach((value, key) => {
          treeElements.push(<TreeEntry key={key} name={value.name} tree={value} readOnly />)
        })

        return (
          <Box shadow={false} key={s.repoName}>
            <Column spacing="m">
              <Title variant="h2">
                <FaGithub />
                &nbsp;{s.repoName}
              </Title>

              <Column spacing="xs">
                <Text variant="secondary" size="small">
                  Commit hash
                </Text>
                <Text className={styles.commits}>{s.commitHash}</Text>
              </Column>
              <Column spacing="s" className={styles.tree}>
                <ul className={styles.directoryList}>{treeElements}</ul>
              </Column>
            </Column>
          </Box>
        )
      })}
    </Column>
  )
}
