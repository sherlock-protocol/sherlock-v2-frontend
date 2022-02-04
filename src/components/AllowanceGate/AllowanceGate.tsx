import { BigNumber } from "ethers"
import React from "react"
import useERC20 from "../../hooks/useERC20"
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

    const tx = await approve(spender, amount)
    await tx?.wait()
    handleFetchAllowance(true)
  }, [approve, spender, amount, handleFetchAllowance])

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
