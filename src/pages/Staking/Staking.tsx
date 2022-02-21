import { BigNumber, ethers, utils } from "ethers"
import React from "react"
import { useDebounce } from "use-debounce"
import AllowanceGate from "../../components/AllowanceGate/AllowanceGate"
import { Box } from "../../components/Box"
import { Button } from "../../components/Button/Button"
import ConnectGate from "../../components/ConnectGate/ConnectGate"
import { Column, Row } from "../../components/Layout"
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import TokenInput from "../../components/TokenInput/TokenInput"
import useERC20 from "../../hooks/useERC20"
import useSherDistManager from "../../hooks/useSherDistManager"
import useSherlock from "../../hooks/useSherlock"
import useWaitTx from "../../hooks/useWaitTx"
import styles from "./Staking.module.scss"

/**
 * Available staking periods, in seconds.
 *
 * TODO: Should be fetched automatically or hardcoded?
 */
export const PERIODS_IN_SECONDS = {
  THREE_MONTHS: 60 * 60 * 24 * 7 * 13,
  SIX_MONTHS: 60 * 60 * 24 * 7 * 26,
  ONE_YEAR: 60 * 60 * 24 * 7 * 52,
}

export const StakingPage: React.FC = () => {
  const [amount, setAmount] = React.useState<BigNumber>()
  const [debouncedAmountBN] = useDebounce(amount, 200)
  const [stakingPeriod, setStakingPeriod] = React.useState<number>()
  const [sherRewards, setSherRewards] = React.useState<BigNumber>()
  const [isLoadingRewards, setIsLoadingRewards] = React.useState(false)

  const { tvl, address, stake, refreshTvl } = useSherlock()
  const { computeRewards } = useSherDistManager()
  const { format: formatSHER } = useERC20("SHER")
  const { format: formatUSDC, balance: usdcBalance } = useERC20("USDC")
  const { waitForTx } = useWaitTx()

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

    setIsLoadingRewards(true)

    const sher = await computeRewards(tvl, debouncedAmountBN, stakingPeriod)
    if (sher) {
      setSherRewards(sher)
    }

    setIsLoadingRewards(false)
  }, [debouncedAmountBN, stakingPeriod, tvl, computeRewards])

  /**
   * Stake USDC for a given period of time
   */
  const handleOnStake = React.useCallback(async () => {
    if (!amount || !stakingPeriod) {
      return
    }

    await waitForTx(async () => (await stake(amount, stakingPeriod)) as ethers.ContractTransaction)

    refreshTvl()
  }, [amount, stakingPeriod, stake, refreshTvl, waitForTx])

  // Compute rewards when amount or period is changed
  React.useEffect(() => {
    handleComputeRewards()
  }, [debouncedAmountBN, handleComputeRewards])

  return (
    <Box>
      <LoadingContainer loading={isLoadingRewards}>
        <Column spacing="m">
          <Title>Stake</Title>
          <Row alignment="space-between">
            <Column>
              <Text>Total Value Locked</Text>
            </Column>
            <Column>{tvl && <Text strong>$ {utils.commify(formatUSDC(tvl))}</Text>}</Column>
          </Row>
          <Row className={styles.rewardsContainer}>
            <Column grow={1} spacing="l">
              <TokenInput onChange={setAmount} token="USDC" placeholder="Choose amount" balance={usdcBalance} />
              <Row spacing="m">
                <Column grow={1}>
                  <Button
                    variant={stakingPeriod === PERIODS_IN_SECONDS.THREE_MONTHS ? "primary" : "alternate"}
                    onClick={() => setStakingPeriod(PERIODS_IN_SECONDS.THREE_MONTHS)}
                  >
                    3 months
                  </Button>
                </Column>
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
              {sherRewards && (
                <>
                  <Row>
                    <hr />
                  </Row>
                  <Row alignment="space-between">
                    <Column>
                      <Text>SHER Reward</Text>
                    </Column>
                    <Column>
                      <Text strong>{utils.commify(formatSHER(sherRewards))} SHER</Text>
                    </Column>
                  </Row>
                </>
              )}
              {amount && stakingPeriod && sherRewards && (
                <Row alignment="center">
                  <ConnectGate>
                    <AllowanceGate amount={amount} spender={address}>
                      <Button onClick={handleOnStake}>Stake</Button>
                    </AllowanceGate>
                  </ConnectGate>
                </Row>
              )}
            </Column>
          </Row>
        </Column>
      </LoadingContainer>
    </Box>
  )
}
