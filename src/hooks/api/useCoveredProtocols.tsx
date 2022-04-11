import React, { useCallback, useState } from "react"
import { BigNumber } from "ethers"
import axios from "./axios"
import { getCoveredProtocols as getCoveredProtocolsUrl } from "./urls"
import coveredProtocolMetas from "../../data/protocols"

export type CoveredProtocol = {
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
}

type GetCoveredProtocolsResponseData =
  | {
      ok: true
      data: {
        agent: string
        bytes_identifier: string
        coverage_ended_at: number
        premium: string
        premium_set_at: number
        coverages: Array<{ claimable_until: number | null; coverage_amount: string; coverage_amount_set_at: number }>
      }[]
    }
  | {
      ok: false
      error: string
    }

type CoveredProtocols = {
  [key: string]: CoveredProtocol
}

const parseResponse = (response: GetCoveredProtocolsResponseData): CoveredProtocols => {
  if (response.ok === false) return {}

  return response.data.reduce((map, p) => {
    // Try to find protocol's metadata
    const metas = coveredProtocolMetas[p.bytes_identifier]

    if (metas) {
      map[p.bytes_identifier] = {
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
        ...metas,
      } as CoveredProtocol
    }

    return map
  }, {} as CoveredProtocols)
}

type CoveredProtocolsContextType = {
  getCoveredProtocols: () => void
  loading: boolean
  data: CoveredProtocols
  error: Error | null
}

const CoveredProtocolsContext = React.createContext<CoveredProtocolsContextType>({} as CoveredProtocolsContextType)

export const useCoveredProtocols = () => {
  return React.useContext(CoveredProtocolsContext)
}

export const CoveredProtocolsProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<CoveredProtocols>({})

  const getCoveredProtocols = useCallback(async () => {
    try {
      setLoading(true)
      const { data: responseData } = await axios.get<GetCoveredProtocolsResponseData>(getCoveredProtocolsUrl())

      if (responseData.ok === true) {
        setData(parseResponse(responseData))
      } else {
        setData({})
        setError(new Error(responseData.error))
      }
      setError(null)
    } catch (error) {
      console.error(error)
      setData({})
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  const ctx = React.useMemo(
    () => ({
      getCoveredProtocols,
      loading,
      data,
      error,
    }),
    [getCoveredProtocols, loading, data, error]
  )

  return <CoveredProtocolsContext.Provider value={ctx}>{children}</CoveredProtocolsContext.Provider>
}
