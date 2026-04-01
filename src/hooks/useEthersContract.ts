import { Contract } from "ethers"
import { useMemo } from "react"
import { useEthersProvider, useEthersSigner } from "../utils/wagmiEthers"

export const useEthersContract = (address: string | undefined, abi: unknown) => {
  const provider = useEthersProvider()
  const signer = useEthersSigner()

  return useMemo(() => {
    if (!address || (!signer && !provider)) {
      return undefined
    }

    return new Contract(address, abi, signer ?? provider)
  }, [address, abi, signer, provider])
}
