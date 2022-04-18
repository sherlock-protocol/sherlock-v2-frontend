export const getFundraisePosition = (account: string) => `positions/${account}/fundraise`
export const getStakePositions = (account?: string) => (account ? `staking/${account}` : "staking")
export const getCoveredProtocols = () => "protocols"
export const getWaitForBlock = (blockNumber: number) => `wait-for-block?block=${blockNumber}`
