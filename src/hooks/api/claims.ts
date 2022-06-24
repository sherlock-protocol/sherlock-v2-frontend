import { useQuery, UseQueryOptions } from "react-query"
import { BigNumber, ethers } from "ethers"
import { DateTime } from "luxon"
import axios from "./axios"

import { getActiveClaim } from "./urls"

/**
 * Time SPCC has to review the claim.
 * After this time, initiator can escalate to UMA.
 */
export const SPCC_REVIEW_DAYS = 7
/**
 * Time claim initiator has to escalate the claim to UMA in case of SPCC denied it.
 * After this time, the claim is closed.
 */
export const UMA_ESCALATION_DAYS = 4 * 7
/**
 * The UMA Halt Operator (UMAHO) is the multisig (controlled by UMA) who gives final approval to pay out a claim
 * This variable represents the amount of time during which UMAHO can block a claim that was approved by the OO
 * After this time period, the claim (which was approved by the OO) is inferred to be approved by UMAHO as well
 */

export const UMAHO_TIME_DAYS = 1
/**
 * Amount needed to escalate the claim to UMA's DVM
 * https://github.com/sherlock-protocol/sherlock-v2-core/blob/45ae92b6488825ce2b0800f0bc4fef78d695a1db/contracts/managers/SherlockClaimManager.sol#L32
 */
export const UMA_BOND = ethers.utils.parseUnits("9600", 6)

export type ClaimStatusUpdate = {
  status: ClaimStatus
  timestamp: number
}

export type Claim = {
  id: number
  protocolID: number
  initiator: string
  receiver: string
  amount: BigNumber
  additionalResourcesLink?: string
  createdAt: number
  exploitStartedAt?: number
  status: ClaimStatus
  statusUpdates: ClaimStatusUpdate[]
}

export enum ClaimStatus {
  //  NonExistent=0, // Claim doesn't exist (this is the default state on creation)
  SpccPending = 1, // Claim is created, SPCC is able to set state to valid
  SpccApproved = 2, // Final state, claim is valid
  SpccDenied = 3, // Claim denied by SPCC, claim can be escalated within 4 weeks
  UmaPriceProposed = 4, // Price is proposed but not escalated
  ReadyToProposeUmaDispute = 5, // Price is proposed, callback received, ready to submit dispute
  UmaDisputeProposed = 6, // Escalation is done, waiting for confirmation
  UmaPending = 7, // Claim is escalated, in case Spcc denied or didn't act within 7 days.
  UmaApproved = 8, // Final state, claim is valid, claim can be enacted after 1 day, umaHaltOperator has 1 day to change to denied
  UmaDenied = 9, // Final state, claim is invalid
  Halted = 10, // UMAHO can halt claim if state is UmaApproved
  Cleaned = 11, // Claim is removed by protocol agent
  PaidOut = 12, // Claim is paid out.
}

export function getSPCCDeadline(claim: Claim) {
  return DateTime.fromSeconds(claim.createdAt).plus({ days: SPCC_REVIEW_DAYS })
}

export function getUMADeadline(claim: Claim) {
  if (claim.status === ClaimStatus.SpccDenied || claim.status === ClaimStatus.SpccPending) {
    return DateTime.fromSeconds(claim.statusUpdates[0].timestamp).plus({ days: UMA_ESCALATION_DAYS })
  }

  return undefined
}

export function isInFinalState(claim: Claim) {
  return [ClaimStatus.PaidOut, ClaimStatus.UmaDenied].includes(claim.status)
}

type GetActiveClaimResponseData =
  | {
      ok: true
      data: {
        id: number
        protocol_id: number
        initiator: string
        receiver: string
        amount: string
        resources_link?: string
        exploit_started_at?: number
        timestamp: number
        status: {
          status: number
          timestamp: number
        }[]
      }
    }
  | {
      ok: true
      data: null
    }
  | {
      ok: false
      error: string
    }

export const activeClaimQueryKey = (protocolID: number) => ["activeClaim", protocolID]
export const useActiveClaim = (protocolID: number, options?: UseQueryOptions<Claim | null, Error>) =>
  useQuery<Claim | null, Error>(
    activeClaimQueryKey(protocolID),
    async () => {
      const { data: response } = await axios.get<GetActiveClaimResponseData>(getActiveClaim(protocolID))

      if (response.ok === false) throw Error(response.error)
      if (response.data === null) return null

      // We discard the claim if its status is "Cleaned"
      if (response.data.status[0].status === ClaimStatus.Cleaned) return null

      return {
        id: response.data.id,
        protocolID: response.data.protocol_id,
        initiator: response.data.initiator,
        receiver: response.data.receiver,
        status: response.data.status[0].status as ClaimStatus,
        amount: BigNumber.from(response.data.amount),
        additionalResourcesLink: response.data.resources_link,
        exploitStartedAt: response.data.exploit_started_at,
        createdAt: response.data.timestamp,
        statusUpdates: response.data.status.map((s) => ({
          status: s.status as ClaimStatus,
          timestamp: s.timestamp,
        })),
      }
    },
    options
  )
