import React from "react"
import { ERC20 } from "../contracts"
import ERC20ABI from "../abi/ERC20.json"
import { useAccount, useContract, useProvider, useSigner } from "wagmi"
import { BigNumber } from "ethers"

/**
 * Hook for interacting with an ERC20 token contract
 * @param contractAddress Contract address for an ERC20 token
 */
const useERC20 = (contractAddress: string) => {
  const [balance, setBalance] = React.useState<BigNumber>()

  const provider = useProvider()
  const [{ data: signerData }] = useSigner()
  const [{ data: accountData }] = useAccount()

  const contract: ERC20 = useContract({
    addressOrName: contractAddress,
    signerOrProvider: signerData || provider,
    contractInterface: ERC20ABI.abi,
  })

  /**
   * Refrehs token balance
   */
  const refreshBalance = React.useCallback(async () => {
    if (!accountData?.address) {
      return
    }

    const latestBalance = await contract.balanceOf(accountData?.address)
    setBalance(latestBalance)
  }, [contract, accountData])

  /**
   * Refresh balance on initialization
   */
  React.useEffect(() => {
    if (!accountData?.address) {
      return
    }

    refreshBalance()
  }, [accountData, refreshBalance])

  return React.useMemo(() => ({ balance, refreshBalance }), [balance, refreshBalance])
}

export default useERC20
