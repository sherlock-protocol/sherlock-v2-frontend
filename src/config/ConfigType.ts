export type Config = {
  /**
   * Running network ID
   */
  networkId: number

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
   * Sherlock Address
   *
   * See: https://github.com/sherlock-protocol/sherlock-v2-core/blob/main/contracts/Sherlock.sol
   */
  sherlockAddress: string

  /**
   * Sherlock Protocol Manager Address
   *
   * See: https://github.com/sherlock-protocol/sherlock-v2-core/blob/main/contracts/managers/SherlockProtocolManager.sol
   */
  sherlockProtocolManagerAddress: string

  /**
   * SHER Token Address
   *
   * See: https://docs.openzeppelin.com/contracts/2.x/api/token/erc20
   */
  sherAddress: string

  /**
   * SherBuy Address
   *
   * See: https://github.com/sherlock-protocol/sherlock-v2-core/blob/main/contracts/SherBuy.sol
   */
  sherBuyAddress: string

  /**
   * SherClaim Address
   *
   * See: https://github.com/sherlock-protocol/sherlock-v2-core/blob/main/contracts/SherClaim.sol
   */
  sherClaimAddress: string

  /**
   * SherDistributionManager
   *
   * See: https://github.com/sherlock-protocol/sherlock-v2-core/blob/main/contracts/managers/SherDistributionManagerEmpty.sol
   */
  sherDistributionManagerAddress: string

  /**
   * USDC Token Address
   *
   * See: https://docs.openzeppelin.com/contracts/2.x/api/token/erc20
   */
  usdcAddress: string
}
