import { BigNumber, ethers } from "ethers"
import React from "react"
import useERC20 from "../../hooks/useERC20"
import useWaitTx from "../../hooks/useWaitTx"
import { Button } from "../Button/Button"

interface Props {
  /**
   * Spender's address
   */
  spender: string

  /**
   * Required amount to spend
   */
  amount?: BigNumber
}

/**
 * HOC for requesting the approval for spending a token
 * before another action
 */
const AllowanceGate: React.FC<Props> = ({ children, spender, amount }) => {
  const [allowance, setAllowance] = React.useState<BigNumber>()

  const { getAllowance, approve } = useERC20("USDC")
  const { waitForTx } = useWaitTx()

  /**
   * Fetch latest allowance
   */
  const handleFetchAllowance = React.useCallback(
    async (invalidateCache: boolean = false) => {
      const latestAllowance = await getAllowance(spender, invalidateCache)
      setAllowance(latestAllowance)
    },
    [setAllowance, spender, getAllowance]
  )

  /**
   * Approve spending
   */
  const handleOnApprove = React.useCallback(async () => {
    if (!amount || !spender) {
      return
    }

    await waitForTx(async () => (await approve(spender, amount)) as ethers.ContractTransaction)

    handleFetchAllowance(true)
  }, [approve, spender, amount, handleFetchAllowance, waitForTx])

  /**
   * Fetch allowance on initialization
   */
  React.useEffect(() => {
    if (!spender || !amount) {
      return
    }

    handleFetchAllowance()
  }, [spender, amount, handleFetchAllowance])

  if (amount && allowance && amount.lte(allowance)) {
    return <>{children}</>
  }

  return <Button onClick={handleOnApprove}>Approve</Button>
}

export default AllowanceGate
