import { BigNumber, ethers } from "ethers"
import React from "react"
import { useDebounce } from "use-debounce"
import { useAccount } from "wagmi"
import AllowanceGate from "../../components/AllowanceGate/AllowanceGate"
import { Box } from "../../components/Box"
import ConnectGate from "../../components/ConnectGate/ConnectGate"
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
import { Container, Divider, HStack, VStack } from "@chakra-ui/react"

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
  const { getStakingPositions, data: stakePositionsData } = useStakingPositions()

  const { tvl, address, stake, refreshTvl } = useSherlock()
  const { computeRewards } = useSherDistManager()
  const { format: formatSHER } = useERC20("SHER")
  const { format: formatUSDC, balance: usdcBalance } = useERC20("USDC")
  const { waitForTx } = useWaitTx()
  const [{ data: accountData }] = useAccount()
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
      return
    }

    const result = await waitForTx(async () => (await stake(amount, stakingPeriod)) as ethers.ContractTransaction, {
      transactionType: TxType.STAKE,
    })

    // Navigate to positions page
    navigate("/positions", { state: { refreshAfterBlockNumber: result.blockNumber } })
  }, [amount, stakingPeriod, stake, waitForTx, navigate])

  // Compute rewards when amount or period is changed
  React.useEffect(() => {
    handleComputeRewards()
  }, [debouncedAmountBN, handleComputeRewards])

  /**
   * Fetch USDC APY
   */
  React.useEffect(() => {
    getStakingPositions(accountData?.address ?? undefined)
  }, [getStakingPositions, accountData?.address])

  return (
    <Box>
      <LoadingContainer loading={isLoadingRewards}>
        <VStack w="full" spacing={2} alignItems="flex-start">
          <Title>Stake</Title>
          <HStack w="full" justifyContent="space-between">
            <Text>Total Value Locked</Text>
            {tvl && (
              <Text strong variant="mono">
                ${formatAmount(formatUSDC(tvl))}
              </Text>
            )}
          </HStack>
          {stakePositionsData && (
            <HStack w="full" justifyContent="space-between">
              <Text>USDC APY</Text>
              <Text strong variant="mono">
                {formatAmount(stakePositionsData?.usdcAPY)}%
              </Text>
            </HStack>
          )}
          <Container bg="brand.bg" p={4}>
            <VStack w="full" spacing={4}>
              <VStack w="full" spacing={4}>
                <TokenInput
                  value={debouncedAmountBN}
                  onChange={setAmount}
                  token="USDC"
                  placeholder="Choose amount"
                  balance={usdcBalance}
                />
                <Options options={STAKING_PERIOD_OPTIONS} value={stakingPeriod} onChange={setStakingPeriod} />
              </VStack>
              {sherRewards && (
                <>
                  <Divider />
                  <HStack w="full" justifyContent="space-between">
                    <Text>SHER Reward</Text>
                    <Text strong variant="mono">
                      {formatAmount(formatSHER(sherRewards))} SHER
                    </Text>
                  </HStack>
                  {stakePositionsData && (
                    <HStack w="full" justifyContent="space-between">
                      <Text>USDC APY</Text>
                      <Text strong variant="mono">
                        {formatAmount(stakePositionsData?.usdcAPY)}%
                      </Text>
                    </HStack>
                  )}
                </>
              )}

              {amount && stakingPeriod && sherRewards && (
                <ConnectGate>
                  <AllowanceGate
                    amount={amount}
                    spender={address}
                    actionName="Stake"
                    action={handleOnStake}
                    onSuccess={refreshTvl}
                  ></AllowanceGate>
                </ConnectGate>
              )}
            </VStack>
          </Container>
          <Text size="small" className={styles.v1}>
            For the Sherlock V1, please see{" "}
            <a href="https://v1.sherlock.xyz" rel="noreferrer" target="_blank">
              https://v1.sherlock.xyz
            </a>
          </Text>
        </VStack>
      </LoadingContainer>
    </Box>
  )
}
