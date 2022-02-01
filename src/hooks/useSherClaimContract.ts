import { useContract, useProvider } from "wagmi"
import SherClaimInterface from "../abi/SherClaim.json"
import { SherClaim } from "../contracts/SherClaim"

export const useSherClaimContract = () => {
  const provider = useProvider()
  const contract = useContract<SherClaim>({
    addressOrName: "0x9a902e8Aae5f1aB423c7aFB29C0Af50e0d3Fea7e",
    contractInterface: SherClaimInterface.abi,
    signerOrProvider: provider,
  })

  return contract
}
