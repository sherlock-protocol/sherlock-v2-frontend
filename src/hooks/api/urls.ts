export const getFundraisePosition = (account: string) => `positions/${account}/fundraise`
export const getTVLOverTime = () => "sherlock_stats"
export const getStakePositions = (account?: string) => (account ? `staking/${account}` : "staking")
