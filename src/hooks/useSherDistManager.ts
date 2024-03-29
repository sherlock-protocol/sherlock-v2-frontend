import React from "react"
import { useContract, useProvider, useSigner } from "wagmi"
import SherDistManagerABI from "../abi/SherDistributionManager"
import { BigNumber } from "ethers"
import config from "../config"

/**
 * Address of Sher Distribution Manager contract
 */
export const SHERLOCK_DIST_MANAGER_ADDRESS = config.sherDistributionManagerAddress

/**
 * React Hook for interacting with Sher Distribution Manager contract.
 *
 * See https://github.com/sherlock-protocol/sherlock-v2-core
 */
const useSherDistManager = () => {
  const provider = useProvider()
  const { data: signerData } = useSigner()
  const contract = useContract({
    address: SHERLOCK_DIST_MANAGER_ADDRESS,
    signerOrProvider: signerData || provider,
    abi: SherDistManagerABI,
  })

  /**
   * Compute SHER rewards for staking USDC for a given period
   *
   * See https://docs.sherlock.xyz/stakers/staking-apy
   *
   * @param tvl Current TVL of Sherlock
   * @param amount Amount of staked USDC
   * @param period Lock period
   */
  const computeRewards = React.useCallback(
    (tvl: BigNumber, amount: BigNumber, period: number) => {
      return contract?.calcReward(tvl, amount, BigNumber.from(period))
    },
    [contract]
  )

  return React.useMemo(
    () => ({
      address: SHERLOCK_DIST_MANAGER_ADDRESS,
      computeRewards,
    }),
    [computeRewards]
  )
}
export default useSherDistManager
