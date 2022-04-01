import { BigNumber, ethers } from "ethers"
import React from "react"
import { ImCheckmark } from "react-icons/im"
import useERC20 from "../../hooks/useERC20"
import useWaitTx from "../../hooks/useWaitTx"
import { TxType } from "../../utils/txModalMessages"
import { Button } from "../Button/Button"
import { Row } from "../Layout"
import styles from "./AllowanceGate.module.scss"
import cx from "classnames"

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
   * Name of the action that takes place
   * after the approval.
   *
   * E.g.: Add Balance / Stake
   */
  actionName?: string

  /**
   * On Click event handler
   */
  action: () => void

  /**
   * Mark the action as successfull and show the checkmark
   */
  success?: boolean

  /**
   * On Succes event handler
   */
  onSuccess?: () => void
}

/**
 * HOC for requesting the approval for spending a token
 * before another action
 */
const AllowanceGate: React.FC<Props> = ({ children, spender, amount, actionName, action, onSuccess }) => {
  const [allowance, setAllowance] = React.useState<BigNumber>()
  const [isSuccess, setIsSuccess] = React.useState(false)

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
   * Execute action and send success notification
   */
  const handleOnAction = React.useCallback(async () => {
    await action()

    setIsSuccess(true)

    onSuccess?.()

    // Refetch allowance since it changed
    handleFetchAllowance(true)
  }, [action, onSuccess, handleFetchAllowance])

  /**
   * Fetch allowance on initialization
   */
  React.useEffect(() => {
    if (!spender || !amount) {
      return
    }

    handleFetchAllowance()
  }, [spender, amount, handleFetchAllowance])

  /**
   * Reset success status on amount change
   */
  React.useEffect(() => {
    setIsSuccess(false)
  }, [amount])

  const hasEnoughAllowance = (amount && allowance && amount.lte(allowance)) ?? false

  return (
    <Row alignment="center" spacing="s" className={styles.buttonGroup}>
      <Button
        className={cx(styles.button, styles.approveButton, {
          [styles.success]: hasEnoughAllowance || isSuccess,
          [styles.disabled]: hasEnoughAllowance || isSuccess,
        })}
        onClick={handleOnApprove}
        disabled={hasEnoughAllowance}
      >
        Approve
      </Button>
      <Button
        disabled={!hasEnoughAllowance || isSuccess}
        className={cx(styles.button, styles.actionButton, {
          [styles.disabled]: !hasEnoughAllowance || isSuccess,
          [styles.success]: isSuccess,
        })}
        onClick={handleOnAction}
      >
        {actionName}
      </Button>
      <div className={cx(styles.checkmark, { [styles.success]: isSuccess })}>
        <ImCheckmark size={32} />
      </div>
    </Row>
  )
}

export default AllowanceGate
