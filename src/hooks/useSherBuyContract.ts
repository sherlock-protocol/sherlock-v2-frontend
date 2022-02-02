import { ethers, BigNumber } from "ethers"
import { useCallback, useMemo } from "react"
import { useContract, useProvider } from "wagmi"
import SherBuyABI from "../abi/SherBuy.json"
import { SherBuy } from "../contracts/SherBuy"

/**
 * SherBuy smart contract address
 */
export const SHER_BUY_ADDRESS = "0x8B7c22003087153972e48dada310b4d7CDC18F32"

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
  const contract = useContract<SherBuy>({
    addressOrName: SHER_BUY_ADDRESS,
    contractInterface: SherBuyABI.abi,
    signerOrProvider: provider,
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
  const getUsdcToSherRewardRatio = useCallback(async () => {
    const stakeRate = await contract.stakeRate()
    const buyRate = await contract.buyRate()

    const convertedStakeRate = Number(ethers.utils.formatUnits(stakeRate, 6))
    const convertedBuyRate = Number(ethers.utils.formatUnits(buyRate, 6))

    const ratio = convertedBuyRate / (convertedBuyRate + convertedStakeRate)

    return ratio
  }, [contract])

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

  return useMemo(
    () => ({
      address: SHER_BUY_ADDRESS,
      getUsdcToSherRewardRatio,
      getCapitalRequirements,
    }),
    [getUsdcToSherRewardRatio, getCapitalRequirements]
  )
}
