import React from "react"
import { useContract, useProvider, useSigner } from "wagmi"
import { SherlockProtocolManager } from "../contracts"
import SherlockProtocolManagerABI from "../abi/SherlockProtocolManager.json"
import { BigNumber, ethers } from "ethers"

/**
 * Address of Sherlock Protocol Manager contract
 */
export const SHERLOCK_PROTOCOL_MANAGER_ADDRESS = process.env.REACT_APP_SHERLOCK_PROTOCOL_MANAGER_ADDRESS as string

/**
 * Array of protocols covered by Sherlock
 */
export const COVERED_PROTOCOLS = {
  SQUEETH: {
    name: "Squeeth by Opyn",
  },
  EULER: {
    name: "Euler",
  },
  PRIMITIVE: {
    name: "Primitive",
  },
  NIFTY_OPTIONS: {
    name: "Nifty Options by Teller",
  },
}

/**
 * React Hook for interacting with Sherlock Protocol Manager contract.
 *
 * See https://github.com/sherlock-protocol/sherlock-v2-core
 */
const useProtocolManager = () => {
  const provider = useProvider()
  const [{ data: signerData }] = useSigner()
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
    async (protocol: keyof typeof COVERED_PROTOCOLS): Promise<BigNumber> => {
      return contract.activeBalance(ethers.utils.formatBytes32String(protocol))
    },
    [contract]
  )

  /**
   * Fetch the protocol's number of seconds of coverage left.
   */
  const getProtocolCoverageLeft = React.useCallback(
    async (protocol: keyof typeof COVERED_PROTOCOLS): Promise<BigNumber> => {
      return contract.secondsOfCoverageLeft(ethers.utils.formatBytes32String(protocol))
    },
    [contract]
  )

  /**
   * Fetch the protocol's premium
   *
   * See https://docs.sherlock.xyz/protocols/premiums
   */
  const getProtocolPremium = React.useCallback(
    async (protocol: keyof typeof COVERED_PROTOCOLS): Promise<BigNumber> => {
      return contract.premium(ethers.utils.formatBytes32String(protocol))
    },
    [contract]
  )

  /**
   * Deposit USDC to a protocol's active balance
   */
  const depositActiveBalance = React.useCallback(
    (protocol: keyof typeof COVERED_PROTOCOLS, amount: BigNumber) => {
      return contract.depositToActiveBalance(ethers.utils.formatBytes32String(protocol), amount)
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
    }),
    [getProtocolActiveBalance, getProtocolCoverageLeft, getProtocolPremium, depositActiveBalance]
  )
}
export default useProtocolManager
