import { useQuery } from "react-query"
import { contests as contestsAPI } from "../axios"
import { getContextQuestions as getContextQuestionsUrl } from "../urls"

export type ContextQuestion = {
  id: number
  question: string
  description: string
  answer: string
}

type GetContextQuestionsResponse = {
  questions: {
    id: number
    question: string
    description: string
    answer: string
  }[]
}

export const contextQuestionsQuery = () => "context-questions"
export const useContextQuestions = (dashboardID?: string) =>
  useQuery<ContextQuestion[], Error>(
    contextQuestionsQuery(),
    async () => {
      const { data } = await contestsAPI.get<GetContextQuestionsResponse>(getContextQuestionsUrl(dashboardID ?? ""))

      return data.questions.map((q) => ({
        id: q.id,
        question: q.question,
        description: q.description,
        answer: q.answer,
      }))
    },
    {
      enabled: !!dashboardID,
    }
  )
