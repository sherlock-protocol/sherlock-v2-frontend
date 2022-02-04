import React from "react"
import { useContract, useProvider, useSigner } from "wagmi"
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
    }),
    [tvl]
  )
}
export default useSherlock
