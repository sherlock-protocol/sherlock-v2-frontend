import React from "react"
import { ERC20 } from "../contracts"
import ERC20ABI from "../abi/ERC20.json"
import { useAccount, useContract, useProvider, useSigner } from "wagmi"
import { BigNumber } from "ethers"

/**
 * Object containing used ERC20 tokens.
 *
 * Adding a new token will update type definitions as well.
 */
const TokenContracts = {
  USDC: process.env.REACT_APP_USDC_ADDRESS as string,
  SHER: process.env.REACT_APP_SHER_ADDRESS as string,
}

type AvailableERC20Tokens = keyof typeof TokenContracts

/**
 * Hook for interacting with an ERC20 token contract
 * @param token ERC20 Token
 * @param contractAddress Contract address for an ERC20 token
 */
const useERC20 = (token?: AvailableERC20Tokens, contractAddress?: string) => {
  const address = token ? TokenContracts[token] : contractAddress
  if (!address) {
    throw Error("Address or token name required")
  }

  const [balance, setBalance] = React.useState<BigNumber>()
  const [allowances, setAllowances] = React.useState<{ [key: string]: BigNumber }>({})

  const provider = useProvider()
  const [{ data: signerData }] = useSigner()
  const [{ data: accountData }] = useAccount()

  const contract: ERC20 = useContract({
    addressOrName: address,
    signerOrProvider: signerData || provider,
    contractInterface: ERC20ABI.abi,
  })

  /**
   * Refresh token balance
   */
  const refreshBalance = React.useCallback(async () => {
    if (!accountData?.address) {
      return
    }

    const latestBalance = await contract.balanceOf(accountData?.address)
    setBalance(latestBalance)
  }, [contract, accountData])

  /**
   * Fetch balance of specific address
   */
  const getBalanceOf = React.useCallback(
    async (address: string) => {
      return contract.balanceOf(address)
    },
    [contract]
  )

  /**
   * Fetch the allowance amount for a given spender
   */
  const getAllowance = React.useCallback(
    async (address: string, invalidateCache?: boolean) => {
      if (!accountData?.address || !address) {
        return
      }

      if (!invalidateCache && allowances[address]) {
        return allowances[address]
      }

      const lastAllowance = await contract.allowance(accountData?.address, address)
      setAllowances({ ...allowances, [address]: lastAllowance })

      return lastAllowance
    },
    [contract, accountData?.address, allowances]
  )

  /**
   * Approve spending amount of tokens for a given address
   */
  const approve = React.useCallback(
    (address: string, amount: BigNumber) => {
      if (!address || !amount) {
        return
      }

      return contract.approve(address, amount)
    },
    [contract]
  )

  /**
   * Refresh balance on initialization
   */
  React.useEffect(() => {
    if (!accountData?.address || !!balance) {
      return
    }

    refreshBalance()
  }, [accountData, refreshBalance, balance])

  return React.useMemo(
    () => ({ balance, refreshBalance, getBalanceOf, getAllowance, approve }),
    [balance, refreshBalance, getAllowance, getBalanceOf, approve]
  )
}

export default useERC20
