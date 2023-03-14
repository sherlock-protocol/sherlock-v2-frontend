import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDebounce } from "use-debounce"
import { Box } from "../../../components/Box"
import { Input } from "../../../components/Input"
import { Column } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { useContextQuestions } from "../../../hooks/api/protocols/useContextQuestions"
import { useSubmitContextQuestionAnswer } from "../../../hooks/api/protocols/useSubmitContextQuestionAnswer"

import styles from "./ContextQuestions.module.scss"

type Answer = {
  questionID: number
  answer: string
}

export const ContextQuestions = () => {
  const { dashboardID } = useParams()
  const { data: contextQuestions } = useContextQuestions(dashboardID)
  const { submitContextQuestionAnswer } = useSubmitContextQuestionAnswer(dashboardID ?? "")

  const [answers, setAnswers] = useState<Answer[]>([])
  const [debouncedAnswers] = useDebounce(answers, 300)

  useEffect(() => {
    submitContextQuestionAnswer(debouncedAnswers)
  }, [debouncedAnswers, submitContextQuestionAnswer])

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

  return (
    <LoadingContainer>
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
      </Column>
    </LoadingContainer>
  )
}
