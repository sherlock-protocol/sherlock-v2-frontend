import { useQuery, UseQueryOptions } from "react-query"
import { BigNumber } from "ethers"
import axios from "./axios"

import { getActiveClaim } from "./urls"

export type Claim = {
  id: number
  protocolID: number
  initiator: string
  receiver: string
  amount: BigNumber
  createdAt: number
  exploitStartedAt?: number
  status: ClaimStatus
  statusUpdatedAt: number
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
  //  Cleaned=11, // Claim is removed by protocol agent
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
        exploit_started_at?: number
        timestamp: number
        status: number
        status_updated_at: number
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

      return {
        id: response.data.id,
        protocolID: response.data.protocol_id,
        initiator: response.data.initiator,
        receiver: response.data.receiver,
        status: response.data.status as ClaimStatus,
        amount: BigNumber.from(response.data.amount),
        exploitStartedAt: response.data.exploit_started_at,
        createdAt: response.data.timestamp,
        statusUpdatedAt: response.data.status_updated_at,
      }
    },
    options
  )
