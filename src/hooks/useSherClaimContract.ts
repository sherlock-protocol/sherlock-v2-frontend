import { useCallback, useMemo } from "react"
import { useContract, useProvider, useSigner } from "wagmi"
import SherClaimInterface from "../abi/SherClaim.json"
import { SherClaim } from "../contracts/SherClaim"
import useWaitTx from "./useWaitTx"

export const SHER_CLAIM_ADDRESS = process.env.REACT_APP_SHER_CLAIM_ADDRESS as string

/**
 * React Hook for interacting with Sherlock's SerClaim smart contract.
 *
 * This contract handles the process of claiming SHER tokens once the fundraising event ends.
 *
 * https://github.com/sherlock-protocol/sherlock-v2-core/blob/main/contracts/SherClaim.sol
 */

export const useSherClaimContract = () => {
  const provider = useProvider()
  const [{ data: signerData }] = useSigner()
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
    const timestampInSeconds = await contract.claimableAt()
    // Convert timestamp to milliseconds and return date obj
    return new Date(timestampInSeconds.toNumber() * 1000)
  }, [contract])

  /**
   * Fetch wether the claim is active (users can claim) or not.
   *
   * @returns true|false
   */
  const claimIsActive = useCallback(async () => {
    const active = await contract.active()
    return active
  }, [contract])

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
