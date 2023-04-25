import React from "react"
import { FaDownload, FaExclamationTriangle, FaGithub } from "react-icons/fa"
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

const COMMENT_TO_SOURCE_MIN = 0.8

export const ContestScopeModal: React.FC<Props> = ({ onClose, contestID }) => {
  const { data: contest, isLoading: contestIsLoading } = useContest(contestID)
  const { data: scope, isLoading: scopeIsLoading } = useAdminContestScope(contestID)

  const submittedNSLOC = scope?.reduce((t, s) => t + (s.nSLOC ?? 0), 0)
  const expectedNSLOCExceeded = contest && scope && (contest.linesOfCode ?? 0) < (submittedNSLOC ?? 0)

  return (
    <Modal closeable onClose={onClose}>
      <LoadingContainer loading={contestIsLoading || scopeIsLoading}>
        <Column spacing="l">
          <Title>{contest?.title}</Title>
          {expectedNSLOCExceeded ? (
            <Column spacing="s" className={styles.warningBox}>
              <Row spacing="xs">
                <FaExclamationTriangle />
                <Text size="small">Submitted nSLOC is higher than expected</Text>
              </Row>
              <Text size="small">
                Expected nSLOC: <strong>{contest?.linesOfCode}</strong>
              </Text>
              <Text size="small">
                Submitted nSLOC: <strong>{submittedNSLOC}</strong>
              </Text>
            </Column>
          ) : null}
          <Column spacing="s">
            {scope?.map((s, index) => (
              <Column spacing="s">
                <Title variant="h2">
                  <FaGithub />
                  &nbsp;{s.repoName}
                </Title>
                <Text variant="mono" size="small" className={styles.mono}>
                  {s.commitHash}
                </Text>
                <Table>
                  <TBody>
                    <Tr>
                      <Td>
                        <Row spacing="s">
                          <Text strong>Contracts:</Text>
                          <Text>{s.files.length}</Text>
                        </Row>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Row spacing="s">
                          <Text strong>nSLOC:</Text>
                          <Text>{s.nSLOC}</Text>
                        </Row>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Row spacing="s">
                          <Text strong>Comments ratio:</Text>
                          <Text>{Math.round(s.commentToSourceRatio! * 100)}%</Text>
                          {s.commentToSourceRatio! < COMMENT_TO_SOURCE_MIN ? (
                            <Row spacing="xs" className={styles.warning}>
                              <FaExclamationTriangle />
                              <Text size="small">Comments ratio is below 80%</Text>
                            </Row>
                          ) : null}
                        </Row>
                      </Td>
                    </Tr>
                  </TBody>
                </Table>
                <Button
                  onClick={() => window.open(s.solidityMetricsReport, "blank")}
                  disabled={!s.solidityMetricsReport}
                >
                  <FaDownload />
                  &nbsp;Download report
                </Button>
                {index < scope.length - 1 ? <hr /> : null}
              </Column>
            ))}
          </Column>
        </Column>
      </LoadingContainer>
    </Modal>
  )
}
