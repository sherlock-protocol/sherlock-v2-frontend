import { BigNumber, ethers } from "ethers"
import React from "react"
import useSherlock from "../../hooks/useSherlock"
import { PERIODS_IN_SECONDS } from "../../pages/Staking"
import { convertSecondsToDurationString } from "../../utils/time"
import { Button } from "../Button/Button"
import styles from "./StakingPosition.module.scss"

interface Props {
  /**
   * Position ID
   */
  id: number
}

const StakingPosition: React.FC<Props> = ({ id }) => {
  const [lockedForSeconds, setLockedForSeconds] = React.useState<number>()
  const [usdcBalance, setUsdcBalance] = React.useState<BigNumber>()
  const [sherRewards, setSherRewards] = React.useState<BigNumber>()
  const [stakingPeriod, setStakingPeriod] = React.useState<number>()
  const isUnlocked = lockedForSeconds && lockedForSeconds <= 0

  const { getPositionLockupEnd, getPositionSherRewards, getPositionUsdcBalance, unstake, restake } = useSherlock()

  /**
   * Fetch the timestamp at which the position
   * can be unstaked or restaked.
   */
  const handleFetchLockupPeriod = React.useCallback(async () => {
    const lockupEnds = await getPositionLockupEnd(id)

    const timeLeft = lockupEnds.sub(BigNumber.from((new Date().valueOf() / 1000).toFixed(0))).toNumber()
    setLockedForSeconds(timeLeft)
  }, [getPositionLockupEnd, id])

  /**
   * Fetch position's current USDC balance, claimable at the end
   * of the lockup period.
   */
  const handleFetchUsdcBalance = React.useCallback(async () => {
    const positionUsdcBalance = await getPositionUsdcBalance(id)
    setUsdcBalance(positionUsdcBalance)
  }, [getPositionUsdcBalance, id])

  /**
   * Fetch position's guaranteed SHER rewards
   */
  const handleFetchSherRewards = React.useCallback(async () => {
    const positionSherRewards = await getPositionSherRewards(id)
    setSherRewards(positionSherRewards)
  }, [getPositionSherRewards, id])

  /**
   * Unstake position
   */
  const handleUnstake = React.useCallback(async () => {
    const tx = await unstake(id)
    await tx.wait()
  }, [unstake, id])

  /**
   * Restake position
   */
  const handleRestake = React.useCallback(async () => {
    if (!stakingPeriod) {
      return
    }

    const tx = await restake(id, stakingPeriod)
    await tx.wait()
  }, [restake, id, stakingPeriod])

  React.useEffect(() => {
    handleFetchLockupPeriod()
    handleFetchSherRewards()
    handleFetchUsdcBalance()
  }, [handleFetchLockupPeriod, handleFetchSherRewards, handleFetchUsdcBalance])

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
