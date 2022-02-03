import { useContract, useProvider } from "wagmi"
import SherTokenInterface from "../abi/SherToken.json"
import { SherToken } from "../contracts/SherToken"

const SHER_TOKEN_ADDRESS = process.env.REACT_APP_SHER_ADDRESS as string

export const useSherTokenContract = () => {
  const provider = useProvider()
  const contract = useContract<SherToken>({
    addressOrName: SHER_TOKEN_ADDRESS,
    contractInterface: SherTokenInterface.abi,
    signerOrProvider: provider,
  })

  return contract
}
