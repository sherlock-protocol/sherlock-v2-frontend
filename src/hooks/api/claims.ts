import { useQuery, UseQueryOptions } from "react-query"
import { BigNumber } from "ethers"
import axios from "./axios"

import { getActiveClaim } from "./urls"

export type Claim = {
  id: number
  protocolID: number
  amount: BigNumber
  createdAt: number
  exploitStartedAt?: number
  status: ClaimStatus
}

enum ClaimStatus {
  NonExistent, // Claim doesn't exist (this is the default state on creation)
  SpccPending, // Claim is created, SPCC is able to set state to valid
  SpccApproved, // Final state, claim is valid
  SpccDenied, // Claim denied by SPCC, claim can be escalated within 4 weeks
  UmaPriceProposed, // Price is proposed but not escalated
  ReadyToProposeUmaDispute, // Price is proposed, callback received, ready to submit dispute
  UmaDisputeProposed, // Escalation is done, waiting for confirmation
  UmaPending, // Claim is escalated, in case Spcc denied or didn't act within 7 days.
  UmaApproved, // Final state, claim is valid, claim can be enacted after 1 day, umaHaltOperator has 1 day to change to denied
  UmaDenied, // Final state, claim is invalid
  Halted, // UMAHO can halt claim if state is UmaApproved
  Cleaned, // Claim is removed by protocol agent
}

type GetActiveClaimResponseData =
  | {
      ok: true
      data: {
        id: number
        protocol_id: number
        amount: string
        exploit_started_at?: number
        timestamp: number
        status: number
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
        status: response.data.status as ClaimStatus,
        amount: BigNumber.from(response.data.amount),
        exploitStartedAt: response.data.exploit_started_at,
        createdAt: response.data.timestamp,
      }
    },
    options
  )
