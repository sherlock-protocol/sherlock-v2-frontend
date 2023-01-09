export const getFundraisePosition = (account: string) => `positions/${account}/fundraise`
export const getUnlockOverTime = () => "stats/unlock"
export const getAPYOverTime = () => "stats/apy"
export const getTVLOverTime = () => "stats_tvl"
export const getTVCOverTime = () => "stats_tvc"
export const getStakePositions = (account?: string) => (account ? `staking/${account}` : "staking")
export const getCoveredProtocols = () => "protocols"
export const getLastIndexedBlock = () => `last-block-indexed`
export const getStrategies = () => "strategies"
export const getActiveClaim = (protocolID: number) => `claims/${protocolID}/active`
export const getAirdropClaims = (account: string) => `airdrop/${account}`

export const getContests = () => "contests"
export const getContest = (id: number) => `contests/${id}`
export const validateSignature = () => "/contests/sign-up/validate-signature"
export const contestSignUp = () => "/contests/sign-up"
export const contestOptIn = () => "/contests/ranking-opt-in"
export const getContestant = (address: string, contestId: number) =>
  `/contests/contestant?address=${address}&contest_id=${contestId}`
export const getScoreboard = () => "scoreboard"
export const getIsAuditor = (address: string) => `is_auditor/${address}`
export const authenticateAuditor = (address: string) => `auditors/${address}`
export const getNonce = () => `nonce`
export const getAuditorProfile = () => "profile"
export const validateDiscordHandle = (handle: string) => `validate_discord_handle?discord_handle=${handle}`

export const updateProfile = () => "profile"
export const signOut = () => "signout"
export const signUp = () => "signup"
export const joinContest = () => "/contests/join-contest"
export const getContestLeaderboard = (id: number) => `/contests/${id}/scoreboard`
export const getProtocolDashboard = (dashboardID: string) => `/contests/dashboard/${dashboardID}`
export const submitPayment = () => "/contests/payments/transaction"

export const getProtocolGithubHandles = (dashboardID: string) => `dashboard/${dashboardID}/github_handles`
export const addProtocolGithubHandle = (dashboardID: string) => `dashboard/${dashboardID}/github_handles`
export const getProtocolDiscordHandles = (dashboardID: string) => `dashboard/${dashboardID}/discord_handles`
export const addProtocolDiscordHandle = (dashboardID: string) => `dashboard/${dashboardID}/discord_handles`
