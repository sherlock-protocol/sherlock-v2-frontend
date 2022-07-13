import { ethers, BigNumber } from "ethers"
import { useCallback, useMemo } from "react"
import { useContract, useProvider, useSigner } from "wagmi"
import SherBuyABI from "../abi/SherBuy.json"
import config from "../config"
import { SherBuy } from "../contracts/SherBuy"

export type { PurchaseEvent } from "../contracts/SherBuy"

/**
 * SherBuy smart contract address
 */
export const SHER_BUY_ADDRESS = config.sherBuyAddress

/**
 * Capital requirements indicate how much USDC is needed to get `sherAmount` of SHER tokens
 * during the fundraising event.
 *
 * @typedef {Object} CapitalRequirements
 * @property {BigNumber} sherAmount - Amount of SHER.
 * @property {BigNumber} stake - Amount of USDC that needs to be staked for a period of time.
 * @property {BigNumber} price - Amount of USDC that needs to be paid.
 */
export type CapitalRequirements = {
  sherAmount: ethers.BigNumber
  stake: ethers.BigNumber
  price: ethers.BigNumber
}

/**
 * React Hook for interacting with Sherlock SerBuy smart contract.
 *
 * https://github.com/sherlock-protocol/sherlock-v2-core/blob/main/contracts/SherBuy.sol
 */

export const useSherBuyContract = () => {
  const provider = useProvider()
  const { data: signerData } = useSigner()
  const contract = useContract<SherBuy>({
    addressOrName: SHER_BUY_ADDRESS,
    contractInterface: SherBuyABI.abi,
    signerOrProvider: signerData || provider,
  })

  /**
   * Fetch stakeRate & buyRate values and calculates the USDC to SHER ratio.
   *
   * Note that this ratio is not meant to be used to calculate the actual price of SHER
   * but how much USDC is needed to get a reward of X amount of SHERS during the fundraise.
   * A portion of the USDC is going to be staked.
   *
   * @returns USDC/SHER ratio
   * @see https://github.com/sherlock-protocol/sherlock-v2-core/blob/main/contracts/SherBuy.sol
   */
  // This will be 0.1 (not going to change ever)
  const getUsdcToSherRewardRatio = 0.1
  /**
   * Fetch USDC needed to buy up to `sherAmountWant` SHER tokens
   *
   * @returns {CapitalRequirementsa} {@link CapitalRequirements}
   */
  const getCapitalRequirements = useCallback(
    async (sherAmountWant: BigNumber): Promise<CapitalRequirements> => {
      return await contract.viewCapitalRequirements(sherAmountWant)
    },
    [contract]
  )

  /**
   * Send USDC to SherBuy smart contract based on the amount of SHER wanted.
   * A portion will be locked in the liquidity pool for X period.
   * The remaining will go to Sherlock in exchange of SHER tokens (available for claim right after the fundraise)
   *
   * @param sherAmountWant - amount of SHER the user is willing to claim
   * @returns void
   */
  const execute = useCallback(
    async (sherAmountWant: BigNumber) => {
      return contract.execute(sherAmountWant)
    },
    [contract]
  )

  return useMemo(
    () => ({
      address: SHER_BUY_ADDRESS,
      getUsdcToSherRewardRatio,
      getCapitalRequirements,
      execute,
    }),
    [getUsdcToSherRewardRatio, getCapitalRequirements, execute]
  )
}
