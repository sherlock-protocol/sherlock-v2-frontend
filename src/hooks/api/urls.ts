export const getFundraisePosition = (account: string) => `positions/${account}/fundraise`
export const getUnlockOverTime = () => "stats/unlock"
export const getAPYOverTime = () => "stats/apy"
export const getTVLOverTime = () => "stats_tvl"
export const getTVCOverTIme = () => "stats_tvc"
export const getStakePositions = (account?: string) => (account ? `staking/${account}` : "staking")
export const getCoveredProtocols = () => "protocols"
export const getWaitForBlock = (blockNumber: number) => `wait-for-block?block=${blockNumber}`
