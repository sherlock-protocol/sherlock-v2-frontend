import { useCallback, useMemo } from "react"
import { useContract, useProvider, useSigner } from "wagmi"
import config from "../config"
import SherlockClaimManagerABI from "../abi/SherlockClaimManager.json"
import { SherlockClaimManager } from "../contracts"
import { BigNumber, ethers } from "ethers"
import { formatUSDC } from "../utils/units"

export const SHERLOCK_CLAIM_MANAGER_ADDRESS = config.sherlockClaimManagerAddress

type HashedRemoteFile = {
  link: string
  hash: string
}

type AncillaryData = {
  Metric: string
  Protocol: string
  ChainId: number
  Value: string
  StartBlock: number
  CoverageAgreement: string
  Resources?: string
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
   * @param exploitStartBlock - Exploit start block number
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
      additionalResources?: HashedRemoteFile
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

  /**
   * Encodes the ancillaryData in to a comma separated key:value pairs string.
   * This is so UMA holders can properly parse and read the information about a certain claim.
   * https://github.com/UMAprotocol/UMIPs/blob/master/UMIPs/umip-132.md#ancillary-data-specifications
   *
   * @param protocol
   * @param amount
   * @param exploitStartBlock
   * @param coverageAgreement - link and hash
   * @param additionalResources - link and hash
   * @returns encoded ancillary data as a comma separated key:value string
   */
  const encodeAncillaryData = (
    protocol: string,
    amount: BigNumber,
    exploitStartBlock: number,
    coverageAgreement: HashedRemoteFile,
    additionalResources?: HashedRemoteFile
  ) => {
    const dataDict: AncillaryData = {
      Metric: "Sherlock exploit claim arbitration",
      Protocol: protocol,
      ChainId: 1,
      Value: formatUSDC(amount),
      StartBlock: exploitStartBlock,
      CoverageAgreement: `${coverageAgreement.link}?hash=${coverageAgreement.hash}`,
    }

    if (additionalResources) {
      dataDict.Resources = `${additionalResources.link}?hash=${additionalResources.hash}`
    }

    const ancillaryDataKeyValuePairs = Object.entries(dataDict).reduce<string[]>(
      (pairs, [key, value]) => [...pairs, `${key}:"${value}"`],
      []
    )

    return ancillaryDataKeyValuePairs.join(",")
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

  /**
   * Escalates claim to UMA's DVM
   * Only the claim initiator can call this method
   */
  const escalateClaim = useCallback(
    async (claimID: number, amount: BigNumber) => {
      return await contract.escalate(claimID, amount)
    },
    [contract]
  )

  /**
   * Clean up claim.
   * Only the protocol agent can call this method.
   */
  const cleanUpClaim = useCallback(
    async (protocolBytesIdentifier: string, claimID: number) => {
      return await contract.cleanUp(protocolBytesIdentifier, claimID)
    },
    [contract]
  )

  return useMemo(
    () => ({
      address: SHERLOCK_CLAIM_MANAGER_ADDRESS,
      startClaim,
      payoutClaim,
      escalateClaim,
      cleanUpClaim,
    }),
    [startClaim, payoutClaim, escalateClaim, cleanUpClaim]
  )
}
