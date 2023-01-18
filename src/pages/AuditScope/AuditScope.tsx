import { useCallback, useEffect, useState } from "react"
import { FaGithub } from "react-icons/fa"
import { Box } from "../../components/Box"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { Column, Row } from "../../components/Layout"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { useRepository } from "../../hooks/api/scope/useRepository"
import { shortenCommitHash } from "../../utils/repository"
import styles from "./AuditScope.module.scss"
import { RepositoryContractsSelector } from "./RepositoryContractsSelector"

type RepositoryState = {
  name: string
  branch: string
  commit: string
}

export const AuditScope = () => {
  const [repoName, setRepoName] = useState("")
  const [repositories, setRepositories] = useState<RepositoryState[]>([])
  const [selectedPaths, setSelectedPaths] = useState<Record<string, string[]>>({})
  const { data: repo, refetch: validateRepo, isLoading } = useRepository(repoName)

  useEffect(() => {
    if (repo && !repositories.some((r) => r.name === repo.name)) {
      setRepositories((r) => [
        ...r,
        {
          name: repo.name,
          branch: repo.mainBranch.name,
          commit: repo.mainBranch.commit,
        },
      ])
      setRepoName("")
    }
  }, [repo, repositories])

  const handlePathSelected = useCallback(
    (repo: string, path: string) => {
      let paths = selectedPaths[repo] ?? []
      const currentIndex = paths.indexOf(path)

      if (currentIndex >= 0) {
        delete paths[currentIndex]
      } else {
        paths = [...paths, path]
      }

      setSelectedPaths((p) => ({
        ...p,
        [repo]: paths,
      }))
    },
    [selectedPaths, setSelectedPaths]
  )

  return (
    <Column className={styles.container}>
      <div className={styles.noise} />
      <Column className={styles.content} spacing="xl">
        <Title>Audit Scope</Title>
        <Box shadow={false} fullWidth>
          <Column spacing="l">
            <Title>Repositories</Title>
            <Column spacing="s">
              <Text>Copy & paste the Github repository link(s) you would like to audit</Text>
              <Input value={repoName} onChange={setRepoName} />
              <Button disabled={isLoading || repoName === ""} onClick={() => validateRepo()}>
                {isLoading ? "Validating repo ..." : "Add repo"}
              </Button>
            </Column>
          </Column>
        </Box>
        {repositories.length > 0 ? (
          <Box shadow={false} fullWidth>
            <Column spacing="l">
              <Title>Branches & commits</Title>
              <Column spacing="s">
                <Text>Select branch and commit hash</Text>
                {repositories.map((r) => (
                  <Row spacing="s">
                    <Input value={r.name} variant="small" disabled />
                    <Button variant="secondary">{r.branch}</Button>
                    <Button variant="secondary">{shortenCommitHash(r.commit)}</Button>
                  </Row>
                ))}
              </Column>
            </Column>
          </Box>
        ) : null}
        {repositories.map((r) => (
          <Box shadow={false} fullWidth>
            <Column spacing="l">
              <Title variant="h2">
                <FaGithub />
                &nbsp;
                {r.name}
              </Title>
              <RepositoryContractsSelector
                repo={r.name}
                commit={r.commit}
                onPathSelected={(path) => handlePathSelected(r.name, path)}
                selectedPaths={selectedPaths[r.name]}
              />
            </Column>
          </Box>
        ))}
      </Column>
    </Column>
  )
}
