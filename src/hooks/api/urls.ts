export const getFundraisePosition = (account: string) => `positions/${account}/fundraise`
export const getUnlockOverTime = () => "stats/unlock"
export const getAPYOverTime = () => "stats/apy"
export const getTVLOverTime = () => "stats_tvl"
export const getTVCOverTime = () => "stats_tvc"
export const getStakePositions = (account?: string) => (account ? `staking/${account}` : "staking")
export const getCoveredProtocols = () => "protocols"
export const getWaitForBlock = (blockNumber: number) => `wait-for-block?block=${blockNumber}`
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
