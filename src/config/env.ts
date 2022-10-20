import { BigNumber } from "ethers"
import { Config } from "./ConfigType"

export const config: Config = {
  networkId: parseInt(process.env.REACT_APP_NETWORK_ID as string),
  localNetworkId: parseInt(process.env.REACT_APP_LOCALHOST_NETWORK_ID as string),
  sherBuyEntryDeadline: parseInt(process.env.REACT_APP_SHER_BUY_ENTRY_DEADLINE as string),
  alchemyApiUrl: process.env.REACT_APP_ALCHEMY_API_URL as string,
  indexerBaseUrl: process.env.REACT_APP_INDEXER_BASE_URL as string,
  contestsApiBaseUrl: process.env.REACT_APP_CONTESTS_API_BASE_URL as string,
  sherlockAddress: process.env.REACT_APP_SHERLOCK_ADDRESS as string,
  sherlockProtocolManagerAddress: process.env.REACT_APP_SHERLOCK_PROTOCOL_MANAGER_ADDRESS as string,
  sherlockClaimManagerAddress: process.env.REACT_APP_SHERLOCK_CLAIM_MANAGER_ADDRESS as string,
  sherAddress: process.env.REACT_APP_SHER_ADDRESS as string,
  sherBuyAddress: process.env.REACT_APP_SHER_BUY_ADDRESS as string,
  sherClaimAddress: process.env.REACT_APP_SHER_CLAIM_ADDRESS as string,
  sherDistributionManagerAddress: process.env.REACT_APP_SHER_DIST_MANAGER_ADDRESS as string,
  usdcAddress: process.env.REACT_APP_USDC_ADDRESS as string,
  countdownStartTimestamp: parseInt(process.env.REACT_APP_COUNTDOWN_START_TIMESTAMP as string),
  countdownEndTimestamp: parseInt(process.env.REACT_APP_COUNTDOWN_END_TIMESTAMP as string),
  incentivesAPYBytesIdentifier: process.env.REACT_APP_INCENTIVES_APY_BYTES_IDENTIFIER as string,
  stakingHardcap: BigNumber.from(
    process.env.REACT_APP_STAKING_HARDCAP ? (process.env.REACT_APP_STAKING_HARDCAP as string) : "0"
  ),
  nexusMutualStartTimestamp: parseInt(process.env.REACT_APP_NEXUS_MUTUAL_START_TIMESTAMP as string),
}
