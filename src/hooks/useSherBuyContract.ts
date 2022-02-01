import { useContract, useProvider } from "wagmi"
import SherBuyInterface from "../abi/SherBuy.json"
import { SherBuy } from "../contracts/SherBuy"

export const useSherBuyContract = () => {
  const provider = useProvider()
  const contract = useContract<SherBuy>({
    addressOrName: "0x8B7c22003087153972e48dada310b4d7CDC18F32",
    contractInterface: SherBuyInterface.abi,
    signerOrProvider: provider,
  })

  return contract
}
