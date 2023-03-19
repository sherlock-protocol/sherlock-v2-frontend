/**
 * Auditor's profile info
 */
export type AuditorProfile = {
  id: number
  handle: string
  githubHandle: string
  discordHandle?: string
  twitterHandle?: string
  telegramHandle?: string
  addresses: {
    id: number
    address: string
  }[]
  managedTeams: {
    id: number
    handle: string
  }[]
  payoutAddress: string
  auditDays: number
  frozen: boolean
  unfreezeDeposit: number
}
