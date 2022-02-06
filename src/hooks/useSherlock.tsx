import React from "react"
import { useAccount, useContract, useProvider, useSigner } from "wagmi"
import { Sherlock } from "../contracts"
import SherlockABI from "../abi/Sherlock.json"
import { BigNumber } from "ethers"

/**
 * Address of Sherlock contract
 */
export const SHERLOCK_ADDRESS = process.env.REACT_APP_SHERLOCK_ADDRESS as string

/**
 * React Hook for interacting with Sherlock contract.
 *
 * See https://github.com/sherlock-protocol/sherlock-v2-core
 */
const useSherlock = () => {
  const [tvl, setTvl] = React.useState<BigNumber>()

  const provider = useProvider()
  const [{ data: signerData }] = useSigner()
  const [{ data: accountData }] = useAccount()
  const contract: Sherlock = useContract({
    addressOrName: SHERLOCK_ADDRESS,
    signerOrProvider: signerData || provider,
    contractInterface: SherlockABI.abi,
  })

  /**
   * Fetch Sherlock's Total Value Locked
   */
  const refreshTvl = React.useCallback(async () => {
    const latestTvl = await contract.totalTokenBalanceStakers()
    setTvl(latestTvl)
  }, [contract])

  /**
   * Stake USDC
   *
   * @param amount Amount of USDC staked
   * @param period Lock time
   */
  const stake = React.useCallback(
    async (amount: BigNumber, period: number) => {
      if (!accountData?.address) {
        return
      }

      return contract.initialStake(amount, period, accountData?.address)
    },
    [accountData?.address, contract]
  )

  /**
   * Fetch the SHER rewards owed to a position
   *
   * @param id Position ID
   */
  const getPositionSherRewards = React.useCallback(
    async (id: number) => {
      return contract.sherRewards(id)
    },
    [contract]
  )

  /**
   * Fetch the current USDC balance of a position,
   * claimable at the end of the lockup period.
   *
   * @param id Position ID
   */
  const getPositionUsdcBalance = React.useCallback(
    async (id: number) => {
      return contract.tokenBalanceOf(id)
    },
    [contract]
  )

  /**
   * Fetch the timestamp at which a position can be
   * restaked or unstaked.
   */
  const getPositionLockupEnd = React.useCallback(
    async (id: number) => {
      return contract.lockupEnd(id)
    },
    [contract]
  )

  /**
   * Unsttake and cash out an unlocked position
   */
  const unstake = React.useCallback(
    async (id: number) => {
      return contract.redeemNFT(id)
    },
    [contract]
  )

  /**
   * Unsttake and cash out an unlocked position
   */
  const restake = React.useCallback(
    async (id: number, period: number) => {
      return contract.redeemNFT(id)
    },
    [contract]
  )

  /**
   * Fetch TVL on initialization
   */
  React.useEffect(() => {
    if (!contract || tvl) {
      return
    }

    refreshTvl()
  }, [contract, tvl, refreshTvl])

  return React.useMemo(
    () => ({
      address: SHERLOCK_ADDRESS,
      tvl,
      refreshTvl,
      stake,
      getPositionLockupEnd,
      getPositionSherRewards,
      getPositionUsdcBalance,
      restake,
      unstake,
    }),
    [tvl, stake, refreshTvl, getPositionLockupEnd, getPositionSherRewards, getPositionUsdcBalance, restake, unstake]
  )
}
export default useSherlock
