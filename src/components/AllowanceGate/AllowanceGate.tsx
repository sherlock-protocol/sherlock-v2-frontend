import { BigNumber, ethers } from "ethers"
import React from "react"
import useERC20 from "../../hooks/useERC20"
import useWaitTx from "../../hooks/useWaitTx"
import { Button } from "../Button/Button"
import { Column } from "../Layout"
import { Text } from "../Text"
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

  return (
    <Column alignment="center" spacing="xl">
      <Button onClick={handleOnApprove}>Approve</Button>
      <Column alignment="start" spacing="xs">
        <Text size="small">
          This is a two step process. Sherlock needs permission to transfer your funds, before initiating the transfer.
        </Text>
        <a href="https://docs.openzeppelin.com/contracts/2.x/api/token/erc20" target="_blank" rel="noreferrer">
          <Text size="small" className={styles.link}>
            Read more about ERC20 security measures
          </Text>
        </a>
      </Column>
    </Column>
  )
}

export default AllowanceGate
