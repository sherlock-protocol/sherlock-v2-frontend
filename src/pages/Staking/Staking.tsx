import { BigNumber, ethers } from "ethers"
import React, { useMemo } from "react"
import { useDebounce } from "use-debounce"
import { useAccount } from "wagmi"
import AllowanceGate from "../../components/AllowanceGate/AllowanceGate"
import { Box } from "../../components/Box"
import { Button } from "../../components/Button/Button"
import ConnectGate from "../../components/ConnectGate/ConnectGate"
import { Column, Row } from "../../components/Layout"
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import TokenInput from "../../components/TokenInput/TokenInput"
import { useStakingPositions } from "../../hooks/api/useStakingPositions"
import useERC20 from "../../hooks/useERC20"
import useSherDistManager from "../../hooks/useSherDistManager"
import useSherlock from "../../hooks/useSherlock"
import useWaitTx from "../../hooks/useWaitTx"
import { formatAmount } from "../../utils/format"
import { TxType } from "../../utils/txModalMessages"
import styles from "./Staking.module.scss"

/**
 * Available staking periods, in seconds.
 *
 * TODO: Should be fetched automatically or hardcoded?
 */
export const PERIODS_IN_SECONDS = {
  SIX_MONTHS: 60 * 60 * 24 * 7 * 26,
  ONE_YEAR: 60 * 60 * 24 * 7 * 52,
}

export const StakingPage: React.FC = () => {
  const [amount, setAmount] = React.useState<BigNumber>()
  const [debouncedAmountBN] = useDebounce(amount, 500)
  // We're removing the 12 months period just for March 30th liquidity event.
  const [stakingPeriod] = React.useState<number>(PERIODS_IN_SECONDS.SIX_MONTHS)
  const [sherRewards, setSherRewards] = React.useState<BigNumber>()
  const [isLoadingRewards, setIsLoadingRewards] = React.useState(false)
  const { getStakingPositions } = useStakingPositions()

  const { tvl, address, stake, refreshTvl } = useSherlock()
  const { computeRewards } = useSherDistManager()
  const { format: formatSHER } = useERC20("SHER")
  const { format: formatUSDC, balance: usdcBalance } = useERC20("USDC")
  const { waitForTx } = useWaitTx()
  const [{ data: accountData }] = useAccount()

  /**
   * March 30th event: Disable staking once 10M TVL is reached.
   */
  const disableStaking = useMemo(() => {
    return tvl && tvl.gte(BigNumber.from("10000000000000"))
  }, [tvl])

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

    await waitForTx(async () => (await stake(amount, stakingPeriod)) as ethers.ContractTransaction, {
      transactionType: TxType.STAKE,
    })

    refreshTvl()
  }, [amount, stakingPeriod, stake, refreshTvl, waitForTx])

  // Compute rewards when amount or period is changed
  React.useEffect(() => {
    handleComputeRewards()
  }, [debouncedAmountBN, handleComputeRewards])

  /**
   * Fetch USDC APY
   */
  React.useEffect(() => {
    if (accountData?.address) {
      getStakingPositions(accountData?.address)
    }
  }, [getStakingPositions, accountData?.address])

  return (
    <Box>
      <LoadingContainer loading={isLoadingRewards}>
        <Column spacing="m">
          <Title>Stake</Title>
          <Row alignment="space-between">
            <Column>
              <Text>Total Value Locked</Text>
            </Column>
            <Column>
              {tvl && (
                <Text strong variant="mono">
                  ${formatAmount(formatUSDC(tvl))}
                </Text>
              )}
            </Column>
          </Row>
          {disableStaking && <Row>Early Adopters LP Round has ended. Please check back in next week.</Row>}
          <Row className={styles.rewardsContainer}>
            <Column grow={1} spacing="l">
              <TokenInput
                onChange={setAmount}
                token="USDC"
                placeholder="Choose amount"
                balance={usdcBalance}
                disabled={disableStaking}
              />
              {/* 
              We're removing the 12 months period just for March 30th liquidity event. 6 months by default.
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
              </Row> */}
              {sherRewards && (
                <>
                  <Row>
                    <hr />
                  </Row>
                  <Row alignment="space-between">
                    <Column>
                      <Text>Lockup period</Text>
                    </Column>
                    <Column>
                      <Text strong variant="mono">
                        6 months
                      </Text>
                    </Column>
                  </Row>
                  <Row alignment="space-between">
                    <Column>
                      <Text>SHER Reward</Text>
                    </Column>
                    <Column>
                      <Text strong variant="mono">
                        {formatAmount(formatSHER(sherRewards))} SHER
                      </Text>
                    </Column>
                  </Row>
                  {/* {stakePositionsData && ( */}
                  <Row alignment="space-between">
                    <Column>
                      <Text>USDC APY</Text>
                    </Column>
                    <Column>
                      <Text strong variant="mono">
                        {/* 
                            We're making the APY fixed to 15% for March 30th liquidity event.
                            {formatAmount(stakePositionsData?.usdcAPY)}% 
                          */}
                        15%
                      </Text>
                    </Column>
                  </Row>
                  {/* )} */}
                </>
              )}

              {amount && stakingPeriod && sherRewards && !disableStaking && (
                <Row alignment="center">
                  <ConnectGate>
                    <AllowanceGate
                      amount={amount}
                      spender={address}
                      render={(disabled) => (
                        <Button disabled={disabled} onClick={handleOnStake}>
                          Stake
                        </Button>
                      )}
                    ></AllowanceGate>
                  </ConnectGate>
                </Row>
              )}
            </Column>
          </Row>
          <Text size="small" className={styles.v1}>
            For the Sherlock V1, please see{" "}
            <a href="https://v1.sherlock.xyz" rel="noreferrer" target="_blank">
              https://v1.sherlock.xyz
            </a>
          </Text>
        </Column>
      </LoadingContainer>
    </Box>
  )
}
