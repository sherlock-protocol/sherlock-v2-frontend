import { useContract, useProvider } from "wagmi"
import SherClaimInterface from "../abi/SherClaim.json"
import { SherClaim } from "../contracts/SherClaim"

export const SHER_CLAIM_ADDRESS = process.env.REACT_APP_SHER_CLAIM_ADDRESS as string

export const useSherClaimContract = () => {
  const provider = useProvider()
  const contract = useContract<SherClaim>({
    addressOrName: SHER_CLAIM_ADDRESS,
    contractInterface: SherClaimInterface.abi,
    signerOrProvider: provider,
  })

  return contract
}
