import { BigNumber } from "ethers"
import React from "react"
import { useDebounce } from "use-debounce"
import AllowanceGate from "../../components/AllowanceGate/AllowanceGate"
import { Button } from "../../components/Button/Button"
import useAmountState from "../../hooks/useAmountState"
import useERC20 from "../../hooks/useERC20"
import useSherDistManager from "../../hooks/useSherDistManager"
import useSherlock from "../../hooks/useSherlock"
import styles from "./Staking.module.scss"

/**
 * Available staking periods, in seconds.
 *
 * TODO: Should be fetched automatically or hardcoded?
 */
const PERIODS_IN_SECONDS = {
  THREE_MONTHS: 60 * 60 * 24 * 7 * 13,
  SIX_MONTHS: 60 * 60 * 24 * 7 * 26,
  ONE_YEAR: 60 * 60 * 24 * 7 * 52,
}

export const StakingPage: React.FC = () => {
  const [amount, amountBN, setAmount] = useAmountState(6)
  const [debouncedAmountBN] = useDebounce(amountBN, 200)
  const [stakingPeriod, setStakingPeriod] = React.useState<number>()
  const [sherRewards, setSherRewards] = React.useState<BigNumber>()

  const { tvl, address } = useSherlock()
  const { computeRewards } = useSherDistManager()
  const { format: formatSHER } = useERC20("SHER")
  const { balance, format: formatUSDC } = useERC20("USDC")

  /**
   * Compute staking rewards for current amount and staking period
   */
  const handleComputeRewards = React.useCallback(async () => {
    if (!stakingPeriod || !tvl) {
      return
    }

    if (!debouncedAmountBN) {
      setSherRewards(undefined)
      return
    }

    const sher = await computeRewards(tvl, debouncedAmountBN, stakingPeriod)
    if (sher) {
      setSherRewards(sher)
    }
  }, [debouncedAmountBN, stakingPeriod, tvl, computeRewards])

  /**
   * Stake USDC for a given period of time
   */
  const handleOnStake = React.useCallback(() => {
    if (!amountBN || !stakingPeriod) {
      return
    }

    console.log("Staking", { amountBN, stakingPeriod })
  }, [amountBN, stakingPeriod])

  // Compute rewards when amount or period is changed
  React.useEffect(() => {
    handleComputeRewards()
  }, [debouncedAmountBN, handleComputeRewards])

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div>{tvl && <p>TVL: {formatUSDC(tvl)} USDC</p>}</div>
        <div>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={balance && `max. ${formatUSDC(balance)} USDC`}
          />
          <span>USDC</span>
        </div>
        <div className={styles.predefinedPeriods}>
          <Button onClick={() => setStakingPeriod(PERIODS_IN_SECONDS.THREE_MONTHS)}>3 months</Button>
          <Button onClick={() => setStakingPeriod(PERIODS_IN_SECONDS.SIX_MONTHS)}>6 months</Button>
          <Button onClick={() => setStakingPeriod(PERIODS_IN_SECONDS.ONE_YEAR)}>12 months</Button>
        </div>
        {sherRewards && (
          <div className={styles.rewardsContainer}>
            <p>SHER Reward: {formatSHER(sherRewards)}</p>
          </div>
        )}
        {amountBN && stakingPeriod && (
          <AllowanceGate amount={amountBN} spender={address}>
            <Button onClick={handleOnStake}>Stake</Button>
          </AllowanceGate>
        )}
      </div>
    </div>
  )
}
