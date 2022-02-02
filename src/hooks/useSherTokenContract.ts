import { useContract, useProvider } from "wagmi"
import SherTokenInterface from "../abi/SherToken.json"
import { SherToken } from "../contracts/SherToken"

export const useSherTokenContract = () => {
  const provider = useProvider()
  const contract = useContract<SherToken>({
    addressOrName: "0x36EFEd637dd1D3D5d9FB89b185a76E6ACF33493B",
    contractInterface: SherTokenInterface.abi,
    signerOrProvider: provider,
  })

  return contract
}
