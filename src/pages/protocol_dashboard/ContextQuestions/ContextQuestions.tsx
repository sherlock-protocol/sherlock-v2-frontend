import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDebounce } from "use-debounce"
import { Box } from "../../../components/Box"
import { Button } from "../../../components/Button"
import { Input } from "../../../components/Input"
import { Column, Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { useContextQuestions } from "../../../hooks/api/protocols/useContextQuestions"
import { useSubmitContextQuestionsAnswers } from "../../../hooks/api/protocols/useSubmitContextQuestionsAnswers"
import { useUpdateContextQuestionAnswers } from "../../../hooks/api/protocols/useUpdateContextQuestionAnswers"
import Modal, { Props as ModalProps } from "../../../components/Modal/Modal"

import styles from "./ContextQuestions.module.scss"
import { ErrorModal } from "../../ContestDetails/ErrorModal"

type Answer = {
  questionID: number
  answer: string
}

type Props = ModalProps & {
  dashboardID: string
  answers: Answer[]
}

const SubmitQuestionsModal: React.FC<Props> = ({ onClose, dashboardID, answers }) => {
  const { submitContextQuestionsAnswers, isLoading, isSuccess, error, reset } =
    useSubmitContextQuestionsAnswers(dashboardID)

  useEffect(() => {
    if (isSuccess) {
      onClose?.()
    }
  }, [isSuccess, onClose])

  const handleCancelClick = useCallback(() => {
    onClose?.()
  }, [onClose])

  const handleConfirmClick = useCallback(() => {
    submitContextQuestionsAnswers(answers)
  }, [answers, submitContextQuestionsAnswers])

  return (
    <Modal closeable onClose={onClose}>
      <LoadingContainer loading={isLoading} label="Updating audit contest repo README ...">
        <Column spacing="xl">
          <Title>Submit Context Answers</Title>
          <Text>Your answers to these questions will be included in the audit repo's README</Text>
          <Text>Once you confirm this action, the answers cannot be changed.</Text>
          <Row spacing="l" alignment={["center"]}>
            <Button variant="secondary" onClick={handleCancelClick}>
              Cancel
            </Button>
            <Button onClick={handleConfirmClick}>Confirm</Button>
          </Row>
        </Column>
      </LoadingContainer>
      {error && <ErrorModal reason={error?.message} onClose={() => reset()} />}
    </Modal>
  )
}

export const ContextQuestions = () => {
  const { dashboardID } = useParams()
  const { data: contextQuestions } = useContextQuestions(dashboardID)
  const { updateContextQuestionAnswers } = useUpdateContextQuestionAnswers(dashboardID ?? "")
  const { submitContextQuestionsAnswers, isLoading } = useSubmitContextQuestionsAnswers(dashboardID ?? "")

  const [answers, setAnswers] = useState<Answer[]>([])
  const [debouncedAnswers] = useDebounce(answers, 300)

  const [submitQuestionsModalOpen, setSubmitQuestionsModalOpen] = useState(false)

  useEffect(() => {
    updateContextQuestionAnswers(debouncedAnswers)
  }, [debouncedAnswers, updateContextQuestionAnswers])

  useEffect(() => {
    setAnswers(
      contextQuestions?.map((q) => ({
        questionID: q.id,
        answer: q.answer,
      })) ?? []
    )
  }, [contextQuestions])

  const handleAnswerChange = useCallback((questionID: number, answer: string) => {
    setAnswers((answers) => {
      const answerIndex = answers?.findIndex((a) => a.questionID === questionID)

      if (answerIndex >= 0) {
        return [
          ...answers?.slice(0, answerIndex),
          {
            questionID,
            answer,
          },
          ...answers?.slice(answerIndex + 1),
        ]
      }
      return answers
    })
  }, [])

  const handleSubmitAnswers = useCallback(() => {
    submitContextQuestionsAnswers(debouncedAnswers)
  }, [submitContextQuestionsAnswers, debouncedAnswers])

  const canSubmit = contextQuestions?.every((q) => q.answer && q.answer !== "") ?? false

  return (
    <LoadingContainer loading={isLoading}>
      <Column spacing="m">
        <Box shadow={false}>
          <Column spacing="m">
            <Title variant="h2">CONTEXT Q&A</Title>
            <Text variant="secondary">
              Please answer the following questions to provide more context on the protocol.
            </Text>
            <Text variant="secondary">The answers will be visible to all Watsons in the audit contest repo.</Text>
          </Column>
        </Box>
        <Box shadow={false} className={styles.questions}>
          <Column spacing="xl">
            {contextQuestions?.map((q) => {
              const answer = answers.find((a) => a.questionID === q.id)
              return (
                <Column key={`question-${q.id}`} spacing="xs">
                  <Text strong>{q.question}</Text>
                  <Text variant="secondary" size="small">
                    {q.description}
                  </Text>
                  <Input
                    variant="small"
                    multiline={true}
                    value={answer?.answer ?? ""}
                    onChange={(value) => handleAnswerChange(q.id, value)}
                  />
                </Column>
              )
            })}
          </Column>
        </Box>
        <Box shadow={false}>
          <Button disabled={!canSubmit} onClick={() => setSubmitQuestionsModalOpen(true)}>
            Submit answers
          </Button>
        </Box>
      </Column>
      {submitQuestionsModalOpen && (
        <SubmitQuestionsModal
          onClose={() => setSubmitQuestionsModalOpen(false)}
          answers={debouncedAnswers}
          dashboardID={dashboardID ?? ""}
        />
      )}
    </LoadingContainer>
  )
}
