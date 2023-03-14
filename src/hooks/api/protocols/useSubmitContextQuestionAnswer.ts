import { useMutation, useQueryClient } from "react-query"
import { contests as contestsAPI } from "../axios"
import { submitContextQuestionAnswer as submitContextQuestionAnswerUrl } from "../urls"
import { ContextQuestion, contextQuestionsQuery } from "./useContextQuestions"

export type SubmitContextQuestionAnswerParams = {
  questionID: number
  answer: string
}[]

type SubmitContextQuestionAnswerContext = {
  previousQuestions?: ContextQuestion[]
}

export const useSubmitContextQuestionAnswer = (dashboardID: string) => {
  const queryClient = useQueryClient()

  const {
    mutate: submitContextQuestionAnswer,
    mutateAsync,
    ...mutation
  } = useMutation<null, Error, SubmitContextQuestionAnswerParams, SubmitContextQuestionAnswerContext>(
    async (params) => {
      await contestsAPI.post(submitContextQuestionAnswerUrl(dashboardID), {
        answers: params.map((p) => ({
          question_id: p.questionID,
          answer: p.answer ?? "",
        })),
      })
      return null
    },
    {
      onMutate: async (params) => {
        const previousQuestions = queryClient.getQueryData<ContextQuestion[]>(contextQuestionsQuery())

        queryClient.setQueryData<ContextQuestion[]>(contextQuestionsQuery(), (previous) => {
          return params.map((q) => {
            const question = previous?.find((qq) => qq.id === q.questionID)

            return {
              id: question!.id,
              question: question!.question,
              description: question!.description,
              answer: q.answer,
            }
          })
        })

        return { previousQuestions }
      },
      onError(err, params, context) {
        queryClient.setQueryData(contextQuestionsQuery(), context?.previousQuestions)
      },
      onSettled(data, error, params) {
        queryClient.invalidateQueries(contextQuestionsQuery())
      },
    }
  )

  return {
    submitContextQuestionAnswer,
    ...mutation,
  }
}
