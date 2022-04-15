export const getFundraisePosition = (account: string) => `positions/${account}/fundraise`
export const getTVLOverTime = () => "stats_tvl"
export const getTVCOverTIme = () => "stats_tvc"
export const getStakePositions = (account?: string) => (account ? `staking/${account}` : "staking")
