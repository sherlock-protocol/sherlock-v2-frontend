import { useQuery } from "react-query"
import { BigNumber } from "ethers"
import axios from "./axios"

import { getCoveredProtocols as getCoveredProtocolsUrl } from "./urls"
import coveredProtocolMetas from "../../data/protocols"

export type Protocol = {
  /**
   * Protocol internal ID (only within indexer domain)
   */
  id: number

  /**
   * Protocol Identifier
   */
  bytesIdentifier: string

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
   * Covered protocol's name
   */
  name?: string

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
  agreement?: string

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
        bytes_identifier: string
        coverage_ended_at: number
        premium: string
        premium_set_at: number
        coverages: Array<{ claimable_until: number | null; coverage_amount: string; coverage_amount_set_at: number }>
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
      // Try to find protocol's metadata
      const metas = coveredProtocolMetas[p.bytes_identifier]

      if (metas) {
        map[p.bytes_identifier] = {
          ...metas,
          id: p.id,
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
        } as Protocol
      }

      return map
    }, {})
  })
