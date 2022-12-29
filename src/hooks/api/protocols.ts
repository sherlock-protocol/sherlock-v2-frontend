import { useQuery } from "react-query"
import { BigNumber } from "ethers"
import axios from "./axios"

import { getCoveredProtocols as getCoveredProtocolsUrl } from "./urls"
import config from "../../config"

export type Protocol = {
  /**
   * Protocol internal ID (only within indexer domain)
   */
  id: number

  /**
   * Protocol Identifier
   */
  bytesIdentifier: `0x${string}`

  /**
   * Protocol agent's address
   */
  agent: string

  /**
   * Date when protocol's coverage has ended, `null` if protocol has active coverage.
   */
  coverageEndedAt: Date | null

  /**
   * Premium amount
   */
  premium: BigNumber

  /**
   * Timestamp when premium was set
   */
  premiumSetAt: Date | null

  /**
   * Covered protocol's name
   */
  name: string

  /**
   * Covered protocol's website
   */
  website?: string

  /**
   * URL to covered protocol's logo
   */
  logo?: string

  /**
   * Covered protocol's description
   */
  description?: string

  /**
   * URL to covered protocol's Statement of Coverage
   */
  agreement: string

  /**
   * Hash of the Statement of Coverage
   */
  agreementHash: string

  /**
   * Current (and previous, if exists) coverages
   */
  coverages: Array<{
    /**
     * Amount covered
     */
    coverageAmount: BigNumber

    /**
     * Timestamp when coverage started
     */
    coverageAmountSetAt: Date
    /**
     * If set, marks the timestamp until protocol agent
     * can submit a claim for this coverage amount
     */
    claimableUntil: Date | null
  }>

  /**
   * Last indexed TVL
   */
  tvl?: BigNumber
}

type GetProtocolsResponseData =
  | {
      ok: true
      data: {
        id: number
        agent: string
        name: string
        description: string
        website?: string
        logo?: string
        bytes_identifier: `0x${string}`
        coverage_ended_at: number
        premium: string
        premium_set_at: number
        coverages: Array<{ claimable_until: number | null; coverage_amount: string; coverage_amount_set_at: number }>
        agreement: string
        agreement_hash: string
        tvl: string
      }[]
    }
  | {
      ok: false
      error: string
    }

type Protocols = {
  [key: string]: Protocol
}

export const protocolsQueryKey = "protocols"
export const useProtocols = () =>
  useQuery<Protocols | null, Error>(protocolsQueryKey, async () => {
    const { data: response } = await axios.get<GetProtocolsResponseData>(getCoveredProtocolsUrl())

    if (response.ok === false) throw Error(response.error)

    return response.data.reduce<Record<string, Protocol>>((map, p) => {
      if (p.bytes_identifier === config.incentivesAPYBytesIdentifier) return map

      map[p.bytes_identifier] = {
        id: p.id,
        name: p.name,
        description: p.description,
        website: p.website,
        logo: p.logo,
        agent: p.agent,
        bytesIdentifier: p.bytes_identifier,
        premium: BigNumber.from(p.premium),
        coverageEndedAt: p.coverage_ended_at ? new Date(p.coverage_ended_at * 1000) : null,
        premiumSetAt: p.premium_set_at ? new Date(p.premium_set_at * 1000) : null,
        coverages: p.coverages.map((item) => ({
          claimableUntil: item.claimable_until ? new Date(item.claimable_until * 1000) : null,
          coverageAmount: BigNumber.from(item.coverage_amount),
          coverageAmountSetAt: new Date(item.coverage_amount_set_at * 1000),
        })),
        tvl: p?.tvl ? BigNumber.from(p?.tvl) : undefined,
        agreement: p.agreement,
        agreementHash: p.agreement_hash,
      }
      return map
    }, {})
  })
