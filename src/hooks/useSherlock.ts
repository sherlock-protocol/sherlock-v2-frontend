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
   * Unsttake and cash out an unlocked position
   */
  const unstake = React.useCallback(
    async (id: BigNumber) => {
      return contract.redeemNFT(id)
    },
    [contract]
  )

  /**
   * Unsttake and cash out an unlocked position
   */
  const restake = React.useCallback(
    async (id: BigNumber, period: number) => {
      return contract.ownerRestake(id, period)
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
      restake,
      unstake,
    }),
    [tvl, stake, refreshTvl, restake, unstake]
  )
}
export default useSherlock
