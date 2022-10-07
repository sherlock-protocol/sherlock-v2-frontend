import React from "react"
import { FaTimes } from "react-icons/fa"

import { Column, Row } from "../../components/Layout"
import { Markdown } from "../../components/Markdown/Markdown"
import { Modal, Props as ModalProps } from "../../components/Modal/Modal"
import { Title } from "../../components/Title"
import { Contest } from "../../hooks/api/contests"
import { Button } from "../../components/Button"

import styles from "./ContestDetails.module.scss"

type Props = ModalProps & {
  contest: Contest
  report?: string
}

export const ReportModal: React.FC<Props> = ({ onClose, report, contest }) => {
  return (
    <Modal closeable onClose={onClose}>
      <Column spacing="xl" className={styles.reportContainer}>
        <Row alignment={["space-between", "center"]}>
          <Title variant="h1">Report for {contest.title}</Title>
          <Button variant="secondary" onClick={onClose}>
            <FaTimes />
          </Button>
        </Row>
        <Row>
          <Column spacing="xl">
            <Markdown content={report} />
          </Column>
        </Row>
        <Row>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Row>
      </Column>
    </Modal>
  )
}
