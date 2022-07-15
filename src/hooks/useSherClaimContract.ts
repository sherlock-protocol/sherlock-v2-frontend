import { useCallback, useMemo } from "react"
import { useContract, useProvider, useSigner } from "wagmi"
import SherClaimInterface from "../abi/SherClaim.json"
import { SherClaim } from "../contracts/SherClaim"
import useWaitTx from "./useWaitTx"
import { DateTime } from "luxon"
import config from "../config"

export const SHER_CLAIM_ADDRESS = config.sherClaimAddress
export const SHER_BUY_ENTRY_DEADLINE = Number.isInteger(config.sherBuyEntryDeadline) ? config.sherBuyEntryDeadline : 0
export const SHER_CLAIM_START = SHER_BUY_ENTRY_DEADLINE + 60 * 60 * 24 * 7 * 26 //(26 weeks)
/**
 * React Hook for interacting with Sherlock's SerClaim smart contract.
 *
 * This contract handles the process of claiming SHER tokens once the fundraising event ends.
 *
 * https://github.com/sherlock-protocol/sherlock-v2-core/blob/main/contracts/SherClaim.sol
 */

export const useSherClaimContract = () => {
  const provider = useProvider()
  const { data: signerData } = useSigner()
  const contract = useContract<SherClaim>({
    addressOrName: SHER_CLAIM_ADDRESS,
    contractInterface: SherClaimInterface.abi,
    signerOrProvider: signerData || provider,
  })
  const { waitForTx } = useWaitTx()

  /**
   * Fetch date at which tokens become available to claim.
   *
   * @returns date
   * @see `claimableAt` smart contract property.
   */
  const getClaimableAt = useCallback(async () => {
    // Convert timestamp to milliseconds and return date obj
    return new Date(SHER_BUY_ENTRY_DEADLINE * 1000)
  }, [])

  /**
   * Fetch wether the claim is active (users can claim) or not.
   *
   * @returns true|false
   */
  const claimIsActive = useCallback(async () => {
    const claimStartDate = DateTime.fromMillis(SHER_CLAIM_START * 1000)
    const now = DateTime.now()
    return now > claimStartDate
  }, [])

  /**
   * Claim SHER tokens.
   */
  const claim = useCallback(async () => {
    const txReceipt = await waitForTx(async () => await contract.claim())
    return txReceipt
  }, [contract, waitForTx])

  /**
   * Fetch the amount of SHER an address can claim once they become claimable
   *
   * @param address - account
   *
   * @returns claimable amount
   */
  const getClaimableAmount = useCallback(
    async (address: string) => {
      const sherAmount = await contract.userClaims(address)
      return sherAmount
    },
    [contract]
  )

  return useMemo(
    () => ({
      address: SHER_CLAIM_ADDRESS,
      getClaimableAt,
      getClaimableAmount,
      claimIsActive,
      claim,
    }),
    [getClaimableAt, getClaimableAmount, claimIsActive, claim]
  )
}
