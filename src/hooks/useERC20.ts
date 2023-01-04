import React from "react"
import ERC20ABI from "../abi/ERC20"
import { Address, useAccount, useContract, useProvider, useSigner } from "wagmi"
import { BigNumber, ethers } from "ethers"
import config from "../config"

/**
 * Object containing used ERC20 tokens.
 *
 * Adding a new token will update type definitions as well.
 */
const TokenData = {
  USDC: {
    contract: config.usdcAddress,
    decimals: 6,
  },
  SHER: {
    contract: config.sherAddress,
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
  const { data: signerData } = useSigner()
  const { address: connectedAddress } = useAccount()

  const contract = useContract({
    address: address,
    signerOrProvider: signerData || provider,
    abi: ERC20ABI,
  })

  /**
   * Refresh token balance
   */
  const refreshBalance = React.useCallback(async () => {
    if (!connectedAddress) {
      return
    }

    const latestBalance = await contract?.balanceOf(connectedAddress)
    setBalance(latestBalance)
  }, [contract, connectedAddress])

  /**
   * Fetch balance of specific address
   */
  const getBalanceOf = React.useCallback(
    async (address: Address) => {
      return contract?.balanceOf(address)
    },
    [contract]
  )

  /**
   * Fetch the allowance amount for a given spender
   */
  const getAllowance = React.useCallback(
    async (address: Address, invalidateCache?: boolean) => {
      if (!connectedAddress || !address) {
        return
      }

      if (!invalidateCache && allowances[address]) {
        return allowances[address]
      }

      const lastAllowance = await contract?.allowance(connectedAddress, address)
      lastAllowance && setAllowances({ ...allowances, [address]: lastAllowance })

      return lastAllowance
    },
    [contract, connectedAddress, allowances]
  )

  /**
   * Approve spending amount of tokens for a given address
   */
  const approve = React.useCallback(
    (address: Address, amount: BigNumber) => {
      if (!address || !amount) {
        return
      }

      return contract?.approve(address, amount)
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
    if (!connectedAddress) {
      return
    }

    refreshBalance()
  }, [connectedAddress, refreshBalance])

  return React.useMemo(
    () => ({ balance, refreshBalance, getBalanceOf, getAllowance, approve, decimals, format }),
    [balance, refreshBalance, getAllowance, getBalanceOf, approve, decimals, format]
  )
}

export default useERC20
