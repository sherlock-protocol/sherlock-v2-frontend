import { ContestDetails } from "../hooks/api/contests/useProtocolDashboard"

type ProtocolDashboardStep = "INITIAL_PAYMENT" | "SCOPE" | "TEAM" | "CONTEXT" | "FINAL_PAYMENT"

export const getCurrentStep = (contest: ContestDetails): ProtocolDashboardStep => {
  if (!contest.initialPaymentComplete) return "INITIAL_PAYMENT"
  if (!contest.scopeReady) return "SCOPE"
  if (!contest.teamHandlesAdded) return "TEAM"
  if (!contest.contextQuestionsReady) return "CONTEXT"

  return "FINAL_PAYMENT"
}
