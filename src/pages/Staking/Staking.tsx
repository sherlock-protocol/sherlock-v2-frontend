import { BigNumber, ethers } from "ethers"
import React from "react"
import { useDebounce } from "use-debounce"
import { useAccount } from "wagmi"
import AllowanceGate from "../../components/AllowanceGate/AllowanceGate"
import { Box } from "../../components/Box"
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
import { useNavigate } from "react-router-dom"
import Options from "../../components/Options/Options"
import USBlockContainer from "../../components/USBlockContainer/USBlockContainer"

/**
 * Available staking periods, in seconds.
 *
 * TODO: Should be fetched automatically or hardcoded?
 */
export const PERIODS_IN_SECONDS = {
  SIX_MONTHS: 60 * 60 * 24 * 7 * 26,
  ONE_YEAR: 60 * 60 * 24 * 7 * 52,
}

const STAKING_PERIOD_OPTIONS = [
  {
    label: "6 months",
    value: PERIODS_IN_SECONDS.SIX_MONTHS,
  },
  { label: "12 months", value: PERIODS_IN_SECONDS.ONE_YEAR },
]

export const StakingPage: React.FC = () => {
  const [amount, setAmount] = React.useState<BigNumber>()
  const [debouncedAmountBN] = useDebounce(amount, 500, {
    equalityFn: (l, r) => (r ? !!l?.eq(r) : l === undefined),
  })
  const [stakingPeriod, setStakingPeriod] = React.useState<number>(STAKING_PERIOD_OPTIONS[0].value)
  const [sherRewards, setSherRewards] = React.useState<BigNumber>()
  const [isLoadingRewards, setIsLoadingRewards] = React.useState(false)
  const [sherRewardsBasis, setSherRewardsBasis] = React.useState<BigNumber>()
  const { getStakingPositions, data: stakePositionsData } = useStakingPositions()

  const { tvl, address, stake, refreshTvl } = useSherlock()
  const { computeRewards } = useSherDistManager()
  const { format: formatSHER } = useERC20("SHER")
  const { format: formatUSDC, balance: usdcBalance } = useERC20("USDC")
  const { waitForTx } = useWaitTx()
  const { address: connectedAddress } = useAccount()
  const navigate = useNavigate()

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
      return false
    }

    try {
      const result = await waitForTx(async () => (await stake(amount, stakingPeriod)) as ethers.ContractTransaction, {
        transactionType: TxType.STAKE,
      })

      // Navigate to positions page
      navigate("/positions", { state: { refreshAfterBlockNumber: result.blockNumber } })
    } catch (e) {
      return false
    }

    return true
  }, [amount, stakingPeriod, stake, waitForTx, navigate])

  // Compute rewards when amount or period is changed
  React.useEffect(() => {
    handleComputeRewards()
  }, [debouncedAmountBN, handleComputeRewards])

  /**
   * Fetch USDC APY
   */
  React.useEffect(() => {
    getStakingPositions(connectedAddress ?? undefined)
  }, [getStakingPositions, connectedAddress])

  /**
   * Fetch SHER rewards for 1 USDC
   */
  React.useEffect(() => {
    async function fetchSherRewards() {
      if (!tvl) {
        return
      }

      const sher = await computeRewards(tvl, ethers.utils.parseUnits("1", 6), PERIODS_IN_SECONDS.SIX_MONTHS)
      if (sher) {
        setSherRewardsBasis(sher)
      }
    }

    fetchSherRewards()
  }, [tvl, computeRewards])

  return (
    <Box>
      <USBlockContainer>
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
            {stakePositionsData && (
              <Row alignment="space-between">
                <Column>
                  <Text>USDC APY</Text>
                </Column>
                <Column>
                  <Text strong variant="mono">
                    {formatAmount(stakePositionsData?.usdcAPY)}%
                  </Text>
                </Column>
              </Row>
            )}
            {sherRewardsBasis && (
              <Row alignment="space-between">
                <Column>
                  <Text>Reward per 1 USDC</Text>
                </Column>
                <Column>
                  <Text strong variant="mono">
                    {formatAmount(formatSHER(sherRewardsBasis))} SHER
                  </Text>
                </Column>
              </Row>
            )}
            <Row className={styles.rewardsContainer}>
              <Column grow={1} spacing="l">
                <TokenInput onChange={setAmount} token="USDC" placeholder="Choose amount" balance={usdcBalance} />
                <Options options={STAKING_PERIOD_OPTIONS} value={stakingPeriod} onChange={setStakingPeriod} />
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
                        <Text strong variant="mono">
                          {formatAmount(formatSHER(sherRewards))} SHER
                        </Text>
                      </Column>
                    </Row>
                    {stakePositionsData && (
                      <Row alignment="space-between">
                        <Column>
                          <Text>USDC APY</Text>
                        </Column>
                        <Column>
                          <Text strong variant="mono">
                            {formatAmount(stakePositionsData?.usdcAPY)}%
                          </Text>
                        </Column>
                      </Row>
                    )}
                  </>
                )}

                {amount && stakingPeriod && sherRewards && (
                  <Row alignment="center">
                    <ConnectGate>
                      <AllowanceGate
                        amount={amount}
                        spender={address}
                        actionName="Stake"
                        action={handleOnStake}
                        onSuccess={refreshTvl}
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
      </USBlockContainer>
    </Box>
  )
}
