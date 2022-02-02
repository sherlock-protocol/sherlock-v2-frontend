import { BigNumber } from "ethers"
import React from "react"
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

  /**
   * Current allowance
   */
  allowance?: BigNumber

  /**
   * Function called to approve the spending of given asset
   */
  onApprove: () => void
}

/**
 * HOC for requesting the approval for spending a token
 * before another action
 */
const AllowanceGate: React.FC<Props> = ({ children, spender, amount, allowance, onApprove }) => {
  if (amount && allowance && amount.lte(allowance)) {
    return <>{children}</>
  }

  return <Button onClick={onApprove}>Approve</Button>
}

export default AllowanceGate
