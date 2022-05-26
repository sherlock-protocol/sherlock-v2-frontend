import React, { useCallback, useMemo } from "react"
import { useContract, useProvider, useSigner } from "wagmi"
import config from "../config"
import SherlockClaimManagerABI from "../abi/SherlockClaimManager.json"
import { SherlockClaimManager } from "../contracts"
import { BigNumber, BytesLike, ethers } from "ethers"
import { DateTime } from "luxon"

export const SHERLOCK_CLAIM_MANAGER_ADDRESS = config.sherlockClaimManagerAddress

/**
 * React Hook for interacting with SherlockClaimManager smart contract
 *
 * See https://github.com/sherlock-protocol/sherlock-v2-core/blob/main/contracts/managers/SherlockClaimManager.sol
 */
export const useClaimManager = () => {
  const provider = useProvider()
  const [{ data: signerData }] = useSigner()
  const contract: SherlockClaimManager = useContract({
    addressOrName: SHERLOCK_CLAIM_MANAGER_ADDRESS,
    signerOrProvider: signerData || provider,
    contractInterface: SherlockClaimManagerABI.abi,
  })

  /**
   * Start a claim (Supposed to be called by protocol's agent only)
   * See https://docs.sherlock.xyz/developer/claims#creating-a-claim
   */
  const startClaim = useCallback(
    async (protocol: string, amount: BigNumber, receiver: string, date: Date, ancilliaryData: string) => {
      const timestamp = DateTime.fromJSDate(date).toSeconds().toFixed(0)
      return await contract.startClaim(
        protocol,
        ethers.utils.parseUnits("1000000", 6),
        receiver,
        1641172334,
        ancilliaryData
      )
    },
    [contract]
  )

  return useMemo(
    () => ({
      SHERLOCK_CLAIM_MANAGER_ADDRESS,
      startClaim,
    }),
    [startClaim]
  )
}
