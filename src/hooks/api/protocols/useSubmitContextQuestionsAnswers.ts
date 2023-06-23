import { useMutation, useQueryClient } from "react-query"
import { contests as contestsAPI } from "../axios"
import { protocolDashboardQuery } from "../contests/useProtocolDashboard"
import { submitContextQuestionAnswers as submitContextQuestionAnswersUrl } from "../urls"

export type SubmitContextQuestionAnswerParams = {
  questionID: number
  answer: string
}[]

export const useSubmitContextQuestionsAnswers = (dashboardID: string) => {
  const queryClient = useQueryClient()

  const {
    mutate: submitContextQuestionsAnswers,
    mutateAsync,
    ...mutation
  } = useMutation<null, Error, SubmitContextQuestionAnswerParams>(
    async (params) => {
      await contestsAPI.post(submitContextQuestionAnswersUrl(dashboardID), {
        answers: params.map((p) => ({
          question_id: p.questionID,
          answer: p.answer ?? "",
        })),
      })

      return null
    },
    {
      onSettled(data, error, params) {
        queryClient.invalidateQueries(protocolDashboardQuery(dashboardID))
      },
    }
  )

  return {
    submitContextQuestionsAnswers,
    ...mutation,
  }
}
