import { BigNumber } from "ethers"
import { Address } from "wagmi"
import { Config } from "./ConfigType"

export const config: Config = {
  networks: (process.env.REACT_APP_NETWORKS as string).split(",").map((n) => parseInt(n)),
  localNetworkId: parseInt(process.env.REACT_APP_LOCALHOST_NETWORK_ID as string),
  sherBuyEntryDeadline: parseInt(process.env.REACT_APP_SHER_BUY_ENTRY_DEADLINE as string),
  alchemyApiUrl: process.env.REACT_APP_ALCHEMY_API_URL as string,
  indexerBaseUrl: process.env.REACT_APP_INDEXER_BASE_URL as string,
  contestsApiBaseUrl: process.env.REACT_APP_CONTESTS_API_BASE_URL as string,
  sherlockAddress: process.env.REACT_APP_SHERLOCK_ADDRESS as Address,
  sherlockProtocolManagerAddress: process.env.REACT_APP_SHERLOCK_PROTOCOL_MANAGER_ADDRESS as Address,
  sherlockClaimManagerAddress: process.env.REACT_APP_SHERLOCK_CLAIM_MANAGER_ADDRESS as Address,
  sherAddress: process.env.REACT_APP_SHER_ADDRESS as Address,
  sherBuyAddress: process.env.REACT_APP_SHER_BUY_ADDRESS as Address,
  sherClaimAddress: process.env.REACT_APP_SHER_CLAIM_ADDRESS as Address,
  sherDistributionManagerAddress: process.env.REACT_APP_SHER_DIST_MANAGER_ADDRESS as Address,
  usdcAddress: (chainId: number) => {
    return (
      {
        1: process.env.REACT_APP_USDC_CONTRACT_MAINNET as Address,
        5: process.env.REACT_APP_USDC_CONTRACT_GOERLI as Address,
        42161: process.env.REACT_APP_USDC_CONTRACT_ARBITRUM_ONE as Address,
        421613: process.env.REACT_APP_USDC_CONTRACT_ARBITRUM_ONE_GOERLI as Address,
        10: process.env.REACT_APP_USDC_CONTRACT_OPTIMISM as Address,
        420: process.env.REACT_APP_USDC_CONTRACT_OPTIMISM_GOERLI as Address,
      }[chainId] ?? (process.env.REACT_APP_USDC_CONTRACT_MAINNET as Address)
    )
  },
  countdownStartTimestamp: parseInt(process.env.REACT_APP_COUNTDOWN_START_TIMESTAMP as string),
  countdownEndTimestamp: parseInt(process.env.REACT_APP_COUNTDOWN_END_TIMESTAMP as string),
  incentivesAPYBytesIdentifier: process.env.REACT_APP_INCENTIVES_APY_BYTES_IDENTIFIER as string,
  stakingHardcap: BigNumber.from(
    process.env.REACT_APP_STAKING_HARDCAP ? (process.env.REACT_APP_STAKING_HARDCAP as string) : "0"
  ),
  nexusMutualStartTimestamp: parseInt(process.env.REACT_APP_NEXUS_MUTUAL_START_TIMESTAMP as string),
  airdropAdress: process.env.REACT_APP_AIRDROP_ADDRESS as string,
  airdropClaimableTimestamp: parseInt(process.env.REACT_APP_AIRDROP_CLAIMABLE_TIMESTAMP as string),
  discordServerLink: process.env.REACT_APP_DISCORD_SERVER_LINK as string,
  usdcAuditorDepositsRecipient: process.env.REACT_APP_USDC_AUDITOR_DEPOSITS_RECIPIENT as Address,
}
