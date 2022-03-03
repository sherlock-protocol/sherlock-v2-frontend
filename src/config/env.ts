import { Config } from "./ConfigType"

export const config: Config = {
  networkId: parseInt(process.env.REACT_APP_NETWORK_ID as string),
  localNetworkId: parseInt(process.env.REACT_APP_LOCALHOST_NETWORK_ID as string),
  launchTimestamp: parseInt(process.env.REACT_APP_LAUNCH_TIMESTAMP as string),
  sherBuyEntryDeadline: parseInt(process.env.REACT_APP_SHER_BUY_ENTRY_DEADLINE as string),
  alchemyApiUrl: process.env.REACT_APP_ALCHEMY_API_URL as string,
  indexerBaseUrl: process.env.REACT_APP_INDEXER_BASE_URL as string,
  sherlockAddress: process.env.REACT_APP_SHERLOCK_ADDRESS as string,
  sherlockProtocolManagerAddress: process.env.REACT_APP_SHERLOCK_PROTOCOL_MANAGER_ADDRESS as string,
  sherAddress: process.env.REACT_APP_SHER_ADDRESS as string,
  sherBuyAddress: process.env.REACT_APP_SHER_BUY_ADDRESS as string,
  sherClaimAddress: process.env.REACT_APP_SHER_CLAIM_ADDRESS as string,
  sherDistributionManagerAddress: process.env.REACT_APP_SHER_DIST_MANAGER_ADDRESS as string,
  usdcAddress: process.env.REACT_APP_USDC_ADDRESS as string,
}
