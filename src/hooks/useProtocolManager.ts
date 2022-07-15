import React from "react"
import { useContract, useProvider, useSigner } from "wagmi"
import { SherlockProtocolManager } from "../contracts"
import SherlockProtocolManagerABI from "../abi/SherlockProtocolManager.json"
import { BigNumber } from "ethers"
import config from "../config"

/**
 * Address of Sherlock Protocol Manager contract
 */
export const SHERLOCK_PROTOCOL_MANAGER_ADDRESS = config.sherlockProtocolManagerAddress

/**
 * React Hook for interacting with Sherlock Protocol Manager contract.
 *
 * See https://github.com/sherlock-protocol/sherlock-v2-core
 */
const useProtocolManager = () => {
  const provider = useProvider()
  const { data: signerData } = useSigner()
  const contract: SherlockProtocolManager = useContract({
    addressOrName: SHERLOCK_PROTOCOL_MANAGER_ADDRESS,
    signerOrProvider: signerData || provider,
    contractInterface: SherlockProtocolManagerABI.abi,
  })

  /**
   * Fetch a protocol's active balance.
   *
   * See https://docs.sherlock.xyz/protocols/premiums#maintaining-an-active-balance
   */
  const getProtocolActiveBalance = React.useCallback(
    async (protocol: string): Promise<BigNumber> => {
      return contract.activeBalance(protocol)
    },
    [contract]
  )

  /**
   * Fetch the protocol's number of seconds of coverage left.
   */
  const getProtocolCoverageLeft = React.useCallback(
    async (protocol: string): Promise<BigNumber> => {
      return contract.secondsOfCoverageLeft(protocol)
    },
    [contract]
  )

  /**
   * Fetch the protocol's premium
   *
   * See https://docs.sherlock.xyz/protocols/premiums
   */
  const getProtocolPremium = React.useCallback(
    async (protocol: string): Promise<BigNumber> => {
      return contract.premium(protocol)
    },
    [contract]
  )

  /**
   * Deposit USDC to a protocol's active balance
   */
  const depositActiveBalance = React.useCallback(
    (protocol: string, amount: BigNumber) => {
      return contract.depositToActiveBalance(protocol, amount)
    },
    [contract]
  )

  /**
   * Withdraw USDC from a protocol's active balance
   */
  const withdrawActiveBalance = React.useCallback(
    (protocol: string, amount: BigNumber) => {
      return contract.withdrawActiveBalance(protocol, amount)
    },
    [contract]
  )

  return React.useMemo(
    () => ({
      address: SHERLOCK_PROTOCOL_MANAGER_ADDRESS,
      getProtocolActiveBalance,
      getProtocolCoverageLeft,
      getProtocolPremium,
      depositActiveBalance,
      withdrawActiveBalance,
    }),
    [getProtocolActiveBalance, getProtocolCoverageLeft, getProtocolPremium, depositActiveBalance, withdrawActiveBalance]
  )
}
export default useProtocolManager
