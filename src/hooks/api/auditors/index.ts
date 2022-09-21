/**
 * Auditor's profile info
 */
export type AuditorProfile = {
  id: number
  handle: string
  discordHandle?: string
  githubHandle?: string
  twitterHandle?: string
  telegramHandle?: string
  addresses: {
    id: number
    address: string
  }[]
  payoutAddress: string
}
