import { useMemo } from "react"
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi"

import config from "../config"
import SherlockABI from "../abi/Sherlock.json"
import { BigNumber } from "ethers"

/**
 * Address of Sherlock contract
 */
export const SHERLOCK_ADDRESS = config.sherlockAddress

export const useStaking = (amount?: BigNumber, period?: number) => {
  const { address: connectedAddress } = useAccount()
  const { config, ...prepare } = usePrepareContractWrite({
    addressOrName: SHERLOCK_ADDRESS,
    contractInterface: SherlockABI.abi,
    functionName: "initialStake",
    args: [amount, period, connectedAddress],
    enabled: !!amount && !!period && !!connectedAddress,
  })
  const { writeAsync, ...write } = useContractWrite(config)

  return useMemo(
    () => ({ stake: writeAsync, error: prepare.error || write.error, isLoading: prepare.isLoading || write.isLoading }),
    [writeAsync, prepare, write]
  )
}
