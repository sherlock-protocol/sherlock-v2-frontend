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

export const getContests = () => "contests"
