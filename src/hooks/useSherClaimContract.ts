import { useContract, useProvider } from "wagmi"
import SherClaimInterface from "../abi/SherClaim.json"
import { SherClaim } from "../contracts/SherClaim"

export const useSherClaimContract = () => {
  const provider = useProvider()
  const contract = useContract<SherClaim>({
    addressOrName: "0xc4864A1e55B5764c44565b173c4D5b744793fAae",
    contractInterface: SherClaimInterface.abi,
    signerOrProvider: provider,
  })

  return contract
}
