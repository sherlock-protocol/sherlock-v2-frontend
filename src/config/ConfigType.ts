import { BigNumber } from "ethers"
import { Address } from "wagmi"

export type Config = {
  /**
   * Supported networks
   */
  networks: number[]

  /**
   * Local network ID (when running a local node)
   */
  localNetworkId?: number

  /**
   * UNIX timestamp when countdown should start
   */
  countdownStartTimestamp: number

  /**
   * UNIX timestamp when countdown should end
   */
  countdownEndTimestamp: number

  /**
   * UNIX timestamp when fundraise SHER tokens can start to be claimed
   */
  sherBuyEntryDeadline: number

  /**
   * Alchemy RPC URL
   */
  alchemyApiUrl: string

  /**
   * Sherlock Indexer API url
   */
  indexerBaseUrl: string

  /**
   * Sherlock Contests API url
   */
  contestsApiBaseUrl: string

  /**
   * Sherlock Address
   *
   * See: https://github.com/sherlock-protocol/sherlock-v2-core/blob/main/contracts/Sherlock.sol
   */
  sherlockAddress: Address

  /**
   * Sherlock Protocol Manager Address
   *
   * See: https://github.com/sherlock-protocol/sherlock-v2-core/blob/main/contracts/managers/SherlockProtocolManager.sol
   */
  sherlockProtocolManagerAddress: Address

  /**
   * SherlockClaimManager Address
   *
   * See: https://github.com/sherlock-protocol/sherlock-v2-core/blob/main/contracts/managers/SherlockClaimManager.sol
   */
  sherlockClaimManagerAddress: Address

  /**
   * SHER Token Address
   *
   * See: https://docs.openzeppelin.com/contracts/2.x/api/token/erc20
   */
  sherAddress: Address

  /**
   * SherBuy Address
   *
   * See: https://github.com/sherlock-protocol/sherlock-v2-core/blob/main/contracts/SherBuy.sol
   */
  sherBuyAddress: Address

  /**
   * SherClaim Address
   *
   * See: https://github.com/sherlock-protocol/sherlock-v2-core/blob/main/contracts/SherClaim.sol
   */
  sherClaimAddress: Address

  /**
   * SherDistributionManager
   *
   * See: https://github.com/sherlock-protocol/sherlock-v2-core/blob/main/contracts/managers/SherDistributionManagerEmpty.sol
   */
  sherDistributionManagerAddress: Address

  /**
   * USDC Token Address
   *
   * See: https://docs.openzeppelin.com/contracts/2.x/api/token/erc20
   */
  usdcAddress: (chainId: number) => Address

  /**
   * Bytes identifier used as a fake protocol to add incentives APY
   */
  incentivesAPYBytesIdentifier: string

  /**
   * Staking pool hard cap (0 if there's no limit).
   * Sometimes, we want to limit the amount of USDC we allow investors to put in.
   */
  stakingHardcap: BigNumber

  /**
   * Nexus Mutual 25% coverage start timestamp (in seconds).
   */
  nexusMutualStartTimestamp: number

  /**
   * Airdrop address
   */
  airdropAdress: string

  /**
   * Airdrop claimable date
   */
  airdropClaimableTimestamp: number

  /**
   * Link to Sherlock's Discord server
   */
  discordServerLink: string

  /**
   * USDC transfers recipient for frozen accounts
   */
  usdcAuditorDepositsRecipient: Address
}
