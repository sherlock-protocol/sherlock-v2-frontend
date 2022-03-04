import { BigNumber, ethers } from "ethers"
import React from "react"
import { FaArrowRight } from "react-icons/fa"
import useERC20 from "../../hooks/useERC20"
import useWaitTx from "../../hooks/useWaitTx"
import { TxType } from "../../utils/txModalMessages"
import { Button } from "../Button/Button"
import { Row } from "../Layout"
import styles from "./AllowanceGate.module.scss"

interface Props {
  /**
   * Spender's address
   */
  spender: string

  /**
   * Required amount to spend
   */
  amount?: BigNumber

  render?: (disabled: boolean) => React.ReactNode
}

/**
 * HOC for requesting the approval for spending a token
 * before another action
 */
const AllowanceGate: React.FC<Props> = ({ children, spender, amount, render }) => {
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

    await waitForTx(async () => (await approve(spender, amount)) as ethers.ContractTransaction, {
      transactionType: TxType.APPROVE,
    })

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

  const hasEnoughAllowance = (amount && allowance && amount.lte(allowance)) ?? true

  if (render) {
    return (
      <Row alignment="center" spacing="l" className={styles.steps}>
        <Button disabled={hasEnoughAllowance} onClick={handleOnApprove}>
          Approve
        </Button>
        <FaArrowRight size={18} color="rgba(255,255,255, 0.9)" />
        {render(!hasEnoughAllowance)}
      </Row>
    )
  }

  if (hasEnoughAllowance) {
    return <>{children}</>
  }

  return (
    <Row alignment="center" spacing="s">
      <Button onClick={handleOnApprove}>Approve</Button>
    </Row>
  )
}

export default AllowanceGate
