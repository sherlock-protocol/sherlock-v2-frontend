import { BigNumber } from "ethers"
import { useQuery } from "react-query"
import axios from "./axios"
import { DateTime } from "luxon"
import { getAirdropClaims as getAirdropClaimsUrl } from "./urls"
import { Address } from "wagmi"

type AirdropClaim = {
  id: number
  index: number
  amount: BigNumber
  claimedAtBlock: number | null
  claimedAt: DateTime | null
  contractAddress: string
  proof: `0x${string}`[]
  tokenSymbol: string
  address: Address
}

type GetAirdropClaimsResponseData =
  | {
      ok: true
      data: {
        id: number
        index: number
        amount: string
        claimed_at_block: number | null
        claimed_at_timestamp: number | null
        contract_address: string
        proof: `0x${string}`[]
        token_symbol: string
        address: Address
      }[]
    }
  | {
      ok: false
      error: string
    }

export const airdropClaimsQueryKey = "airdropClaims"
export const useAirdropClaims = (address?: string) =>
  useQuery<AirdropClaim[], Error>(
    airdropClaimsQueryKey,
    async () => {
      const { data: response } = await axios.get<GetAirdropClaimsResponseData>(getAirdropClaimsUrl(address!))

      if (response.ok === false) throw Error(response.error)
      if (response.data === null) return []

      console.log(response.data)

      return response.data.map((entry) => ({
        id: entry.id,
        index: entry.index,
        amount: BigNumber.from(entry.amount),
        claimedAtBlock: entry.claimed_at_block,
        claimedAt: entry.claimed_at_timestamp ? DateTime.fromSeconds(entry.claimed_at_timestamp) : null,
        contractAddress: entry.contract_address,
        proof: entry.proof,
        tokenSymbol: entry.token_symbol,
        address: entry.address,
      }))
    },
    { enabled: !!address }
  )
