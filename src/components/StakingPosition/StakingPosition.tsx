import { BigNumber, ethers } from "ethers"
import React from "react"
import useSherlock from "../../hooks/useSherlock"
import useWaitTx from "../../hooks/useWaitTx"
import { PERIODS_IN_SECONDS } from "../../pages/Staking"
import { formattedTimeDifference } from "../../utils/dates"
import { commify } from "../../utils/units"
import { Box } from "../Box"
import { Button } from "../Button/Button"
import { Column, Row } from "../Layout"
import { Text } from "../Text"
import { Title } from "../Title"
import styles from "./StakingPosition.module.scss"

interface Props {
  /**
   * Position ID
   */
  id: BigNumber

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
   * The timestamp at which the position
   * can be unstaked or restaked
   */
  lockupEnd: Date

  /**
   * Annual Percentage Yield
   */
  apy?: number
}

const StakingPosition: React.FC<Props> = ({ id, usdcBalance, sherRewards, lockupEnd, apy }) => {
  const [stakingPeriod, setStakingPeriod] = React.useState<number>()
  const isUnlocked = lockupEnd <= new Date()

  const { unstake, restake } = useSherlock()
  const { waitForTx } = useWaitTx()

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
    <Box>
      <Column spacing="m">
        <Title>Position #{id.toString()}</Title>
        <Row alignment="space-between" spacing="m">
          <Column>
            <Text>USDC Balance</Text>
          </Column>
          <Column>
            <Text strong variant="mono">
              {commify(parseFloat(ethers.utils.formatUnits(usdcBalance, 6)).toFixed(6))} USDC
            </Text>
          </Column>
        </Row>
        <Row alignment="space-between" spacing="m">
          <Column>
            <Text>SHER Balance</Text>
          </Column>
          <Column>
            <Text strong variant="mono">
              {ethers.utils.commify(parseFloat(ethers.utils.formatUnits(sherRewards, 18)).toFixed(6))} SHER
            </Text>
          </Column>
        </Row>
        <Row alignment="space-between" spacing="m">
          <Column>
            <Text>Unlocks in</Text>
          </Column>
          <Column>
            <Text strong variant="mono">
              {formattedTimeDifference(lockupEnd, ["days", "hours", "minutes"])}
            </Text>
          </Column>
        </Row>
        {apy !== null && apy !== undefined && (
          <Row alignment="space-between" spacing="m">
            <Column>
              <Text>USDC APY</Text>
            </Column>
            <Column>
              <Text strong variant="mono">
                {apy}%
              </Text>
            </Column>
          </Row>
        )}
        {isUnlocked && (
          <Column className={styles.container} spacing="m">
            <Row spacing="m">
              <Column grow={1}>
                <Button
                  variant={stakingPeriod === PERIODS_IN_SECONDS.SIX_MONTHS ? "primary" : "alternate"}
                  onClick={() => setStakingPeriod(PERIODS_IN_SECONDS.SIX_MONTHS)}
                >
                  6 months
                </Button>
              </Column>
              <Column grow={1}>
                <Button
                  variant={stakingPeriod === PERIODS_IN_SECONDS.ONE_YEAR ? "primary" : "alternate"}
                  onClick={() => setStakingPeriod(PERIODS_IN_SECONDS.ONE_YEAR)}
                >
                  12 months
                </Button>
              </Column>
            </Row>
            <Row spacing="m">
              <Column grow={1}>
                <Button variant="secondary" onClick={handleUnstake}>
                  Unstake
                </Button>
              </Column>
              <Column grow={1}>
                <Button variant="primary" onClick={handleRestake} disabled={!stakingPeriod}>
                  Restake
                </Button>
              </Column>
            </Row>
          </Column>
        )}
      </Column>
    </Box>
  )
}

export default StakingPosition
