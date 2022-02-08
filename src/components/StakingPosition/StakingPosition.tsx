import { BigNumber, ethers } from "ethers"
import React from "react"
import useSherlock from "../../hooks/useSherlock"
import useWaitTx from "../../hooks/useWaitTx"
import { PERIODS_IN_SECONDS } from "../../pages/Staking"
import { convertSecondsToDurationString } from "../../utils/time"
import { Button } from "../Button/Button"
import styles from "./StakingPosition.module.scss"

interface Props {
  /**
   * Position ID
   */
  id: number

  /**
   * Current USDC balance, claimable at the end
   * of the lockup period.
   */
  usdcBalance: BigNumber

  /**
   * Guaranteed SHER rewards
   */
  sherRewards: BigNumber

  /**
   * The timestampt at which the position
   * can be unstaked or restaked
   */
  lockupEnd: BigNumber
}

const StakingPosition: React.FC<Props> = ({ id, usdcBalance, sherRewards, lockupEnd }) => {
  const [lockedForSeconds, setLockedForSeconds] = React.useState<number>()
  const [stakingPeriod, setStakingPeriod] = React.useState<number>()
  const isUnlocked = lockedForSeconds && lockedForSeconds <= 0

  const { unstake, restake } = useSherlock()
  const { waitForTx } = useWaitTx()

  /**
   * Compute time left until position unlocks
   */
  React.useEffect(() => {
    const timeLeft = lockupEnd.sub(BigNumber.from((new Date().valueOf() / 1000).toFixed(0))).toNumber()
    setLockedForSeconds(timeLeft)
  }, [lockupEnd])

  /**
   * Unstake position
   */
  const handleUnstake = React.useCallback(async () => {
    await waitForTx(async () => await unstake(id))
  }, [unstake, id, waitForTx])

  /**
   * Restake position
   */
  const handleRestake = React.useCallback(async () => {
    if (!stakingPeriod) {
      return
    }

    await waitForTx(async () => await restake(id, stakingPeriod))
  }, [restake, id, stakingPeriod, waitForTx])

  return (
    <div className={styles.container}>
      <p>ID: {id} </p>
      {usdcBalance && <p>USDC Balance: {ethers.utils.commify(ethers.utils.formatUnits(usdcBalance, 6))} USDC</p>}
      {sherRewards && <p>SHER Balance: {ethers.utils.commify(ethers.utils.formatUnits(sherRewards, 18))} SHER</p>}
      {lockedForSeconds && <p>Position unlocks: {convertSecondsToDurationString(lockedForSeconds)}</p>}
      <p>Current APY: 82%</p>
      {isUnlocked && (
        <>
          <div>
            <Button onClick={() => setStakingPeriod(PERIODS_IN_SECONDS.THREE_MONTHS)}>3 months</Button>
            <Button onClick={() => setStakingPeriod(PERIODS_IN_SECONDS.SIX_MONTHS)}>6 months</Button>
            <Button onClick={() => setStakingPeriod(PERIODS_IN_SECONDS.ONE_YEAR)}>12 months</Button>
          </div>
          <div>
            <Button onClick={handleRestake} disabled={!stakingPeriod}>
              Restake
            </Button>
          </div>
          <div>
            <Button onClick={handleUnstake}>Unstake</Button>
          </div>
        </>
      )}
    </div>
  )
}

export default StakingPosition
