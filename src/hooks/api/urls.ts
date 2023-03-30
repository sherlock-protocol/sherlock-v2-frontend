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
export const getDebtHistory = () => "debt-history"
export const validateDiscordHandle = (handle: string) =>
  `validate_discord_handle?discord_handle=${encodeURIComponent(handle)}`

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
export const finalizeSubmission = (dashboardID: string) => `dashboard/${dashboardID}/finalize_submission`
export const submitScope = (dashboardID: string) => `dashboard/${dashboardID}/submit_scope`
export const getScope = (dashboardID: string) => `dashboard/${dashboardID}/audit_scope`
export const addScope = (dashboardID: string) => `dashboard/${dashboardID}/audit_scope`
export const updateScope = (dashboardID: string, repoName: string) => `dashboard/${dashboardID}/audit_scope/${repoName}`
export const deleteScope = (dashboardID: string, repoName: string) => `dashboard/${dashboardID}/audit_scope/${repoName}`
export const getContextQuestions = (dashboardID: string) => `dashboard/${dashboardID}/context_questions`
export const updateContextQuestionAnswers = (dashboardID: string) => `dashboard/${dashboardID}/context_questions`
export const submitContextQuestionAnswers = (dashboardID: string) => `dashboard/${dashboardID}/submit_answers`

export const getAdminProfile = () => `/admin/profile`
export const adminSignIn = () => `/admin/signin`
export const adminSignOut = () => `/admin/signout`
export const getAdminNonce = () => `/admin/nonce`
export const getAdminContests = () => `/admin/contests`
export const getAdminContestTweetPreview = (contestID: number) =>
  `/admin/contests/${contestID}/announcement_tweet_preview`
export const adminApproveContest = () => `/admin/approve_contest`
export const adminApproveStart = () => `/admin/approve_start`
export const getAdminProtocol = (name: string) => `/admin/protocol/${name}`
export const getAdminContestScope = (contestID: number) => `/admin/contest/${contestID}/scope`
export const adminCreateContest = () => `/admin/contests`
export const getAdminTwitterAccount = (handle: string) => `/admin/twitter_account/${handle}`
export const adminSubmitScope = () => `/admin/scope`
export const getSeniorWatson = (handle: string) => `/admin/senior_watson?handle=${handle}`
export const adminStartLeadSeniorWatsonSelection = () => `/admin/start_lead_senior_watson_selection`
export const adminSelectLeadSeniorWatson = () => `/admin/select_lead_senior_watson`

export const getRepositoryBranches = (repo: string) => `/audit_scope/${repo}/branches`
export const getRepositoryCommits = (repo: string, branch: string) => `/audit_scope/${repo}/${branch}/commits`
export const getRepositoryContracts = (repo: string, commit: string) => `/audit_scope/${repo}/${commit}/contracts`
