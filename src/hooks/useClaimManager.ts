import React, { useCallback, useMemo } from "react"
import { useContract, useProvider, useSigner } from "wagmi"
import config from "../config"
import SherlockClaimManagerABI from "../abi/SherlockClaimManager.json"
import { SherlockClaimManager } from "../contracts"
import { BigNumber, BytesLike, ethers } from "ethers"
import { DateTime } from "luxon"
import { formatUSDC } from "../utils/units"

export const SHERLOCK_CLAIM_MANAGER_ADDRESS = config.sherlockClaimManagerAddress

type HashedRemoteFile = {
  link: string
  hash: string
}

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
   *
   * @param protocol - Protocol bytes identifier
   * @param amount - Amount to be claimed by the protocol
   * @param receiver - Address that's potentially receiving the payout
   * @param exploitTimestamp - Exploit start time (in seconds)
   * @param coverageAgreement - Protocol's current coverage agreement link, along with its hash
   * @param additionalResources - Additional evidence from the protocol. PDF file link, along with its hash
   */
  const startClaim = useCallback(
    async (
      protocol: string,
      amount: BigNumber,
      receiver: string,
      exploitStartBlock: number,
      coverageAgreement: HashedRemoteFile,
      additionalResources: HashedRemoteFile
    ) => {
      const block = await provider.getBlock(exploitStartBlock)
      const ancillaryData = encodeAncillaryData(
        protocol,
        amount,
        exploitStartBlock,
        coverageAgreement,
        additionalResources
      )
      const ancillaryDataBytes = ethers.utils.toUtf8Bytes(ancillaryData)

      return await contract.startClaim(protocol, amount, receiver, block.timestamp, ancillaryDataBytes)
    },
    [contract, provider]
  )

  const encodeAncillaryData = (
    protocol: string,
    amount: BigNumber,
    exploitStartBlock: number,
    coverageAgreement: HashedRemoteFile,
    additionalResources: HashedRemoteFile
  ) => {
    const dataDict = {
      Metric: "Sherlock exploit claim arbitration",
      Protocol: protocol,
      ChainId: 1,
      Value: formatUSDC(amount),
      StartBlock: exploitStartBlock,
      Resources: `${additionalResources.link}?hash=${additionalResources.hash}`,
      CoverageAgreement: `${coverageAgreement.link}?hash=${coverageAgreement.hash}`,
    }

    return Object.entries(dataDict).reduce((str, [key, value]) => str + `${key}:"${value}",`, "")
  }

  /**
   * Pays out the claim.
   * Only the claim initiator can call this method, regardless of who is the current protocol's agent.
   */
  const payoutClaim = useCallback(
    async (claimID: number) => {
      return await contract.payoutClaim(claimID)
    },
    [contract]
  )

  return useMemo(
    () => ({
      SHERLOCK_CLAIM_MANAGER_ADDRESS,
      startClaim,
      payoutClaim,
    }),
    [startClaim, payoutClaim]
  )
}
