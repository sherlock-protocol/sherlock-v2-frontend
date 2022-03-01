import React from "react"
import { ERC20 } from "../contracts"
import ERC20ABI from "../abi/ERC20.json"
import { useAccount, useContract, useProvider, useSigner } from "wagmi"
import { BigNumber, ethers } from "ethers"

/**
 * Object containing used ERC20 tokens.
 *
 * Adding a new token will update type definitions as well.
 */
const TokenData = {
  USDC: {
    contract: process.env.REACT_APP_USDC_ADDRESS as string,
    decimals: 6,
  },
  SHER: {
    contract: process.env.REACT_APP_SHER_ADDRESS as string,
    decimals: 18,
  },
}

type AvailableERC20Tokens = keyof typeof TokenData

/**
 * Hook for interacting with an ERC20 token contract
 * @param token ERC20 Token
 * @param contractAddress Contract address for an ERC20 token
 */
const useERC20 = (token: AvailableERC20Tokens) => {
  const address = TokenData[token].contract
  if (!address) {
    throw Error("Address or token name required")
  }

  const decimals = TokenData[token].decimals
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
  }, [contract, accountData?.address])

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
   * Format amount
   */
  const format = React.useCallback(
    (amount: BigNumber) => {
      return ethers.utils.formatUnits(amount, decimals)
    },
    [decimals]
  )

  /**
   * Refresh balance on initialization, or on account change
   */
  React.useEffect(() => {
    if (!accountData?.address) {
      return
    }

    refreshBalance()
  }, [accountData?.address, refreshBalance])

  return React.useMemo(
    () => ({ balance, refreshBalance, getBalanceOf, getAllowance, approve, decimals, format }),
    [balance, refreshBalance, getAllowance, getBalanceOf, approve, decimals, format]
  )
}

export default useERC20
