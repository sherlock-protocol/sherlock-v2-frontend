import React from "react"
import { FaDownload, FaGithub } from "react-icons/fa"
import { Button } from "../../../components/Button"
import { Column, Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import Modal, { Props as ModalProps } from "../../../components/Modal/Modal"
import { Table, TBody, Td, Tr } from "../../../components/Table/Table"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { useAdminContestScope } from "../../../hooks/api/admin/useAdminContestScope"
import { useContest } from "../../../hooks/api/contests"

import styles from "./AdminContestsList.module.scss"

type Props = ModalProps & {
  contestID: number
}

export const ContestScopeModal: React.FC<Props> = ({ onClose, contestID }) => {
  const { data: contest, isLoading: contestIsLoading } = useContest(contestID)
  const { data: scope, isLoading: scopeIsLoading } = useAdminContestScope(contestID)

  return (
    <Modal closeable onClose={onClose}>
      <LoadingContainer loading={contestIsLoading || scopeIsLoading}>
        <Column spacing="l">
          <Title>{contest?.title}</Title>
          <Column spacing="s">
            <Table>
              <TBody>
                <Tr>
                  <Td>
                    <Row spacing="s">
                      <Text strong>Contracts:</Text>
                      <Text>{scope?.reduce((t, s) => t + s.files.length, 0)}</Text>
                    </Row>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Row spacing="s">
                      <Text strong>nLSOC:</Text>
                      <Text>{contest?.linesOfCode}</Text>
                    </Row>
                  </Td>
                </Tr>
              </TBody>
            </Table>
            <Title variant="h2">Repositories in scope</Title>
            {scope?.map((s) => (
              <Column spacing="s">
                <Title variant="h3">
                  <FaGithub />
                  &nbsp;{s.repoName}
                </Title>
                <Text variant="mono" size="small" className={styles.mono}>
                  {s.commitHash}
                </Text>
                <Button
                  onClick={() => window.open(s.solidityMetricsReport, "blank")}
                  disabled={!s.solidityMetricsReport}
                >
                  <FaDownload />
                  &nbsp;Download report
                </Button>
              </Column>
            ))}
          </Column>
        </Column>
      </LoadingContainer>
    </Modal>
  )
}
