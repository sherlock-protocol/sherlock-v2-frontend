import React, { useEffect, useMemo, useState } from "react"
import { BigNumber, ethers, utils } from "ethers"
import { useDebounce } from "use-debounce"
import { useNavigate } from "react-router-dom"

import AllowanceGate from "../../components/AllowanceGate/AllowanceGate"
import { Button } from "../../components/Button/Button"
import { Box } from "../../components/Box"
import { Title } from "../../components/Title"
import { Text } from "../../components/Text"
import { Column, Row } from "../../components/Layout"

import { useSherBuyContract } from "../../hooks/useSherBuyContract"
import { useSherClaimContract } from "../../hooks/useSherClaimContract"
import useERC20 from "../../hooks/useERC20"
import ConnectGate from "../../components/ConnectGate/ConnectGate"
import useWaitTx from "../../hooks/useWaitTx"

import { formattedTimeDifference } from "../../utils/dates"

import styles from "./Fundraising.module.scss"
import TokenInput from "../../components/TokenInput/TokenInput"
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer"
import { TxType } from "../../utils/txModalMessages"

type Rewards = {
  /**
   * Amount of SHER available to claim after once the fundraise event finishes.
   */
  sherAmount: ethers.BigNumber
  /**
   * Amount of USDC that needs to be staked for a period of time.
   */
  stake: ethers.BigNumber
  /**
   * Amount of USDC that needs to be paid to get SHER rewards.
   */
  price: ethers.BigNumber
}

export const FundraisingPage: React.FC = () => {
  const navigate = useNavigate()
  const sherBuyContract = useSherBuyContract()
  const sherClaimContract = useSherClaimContract()
  const sher = useERC20("SHER")
  const { balance: usdcBalance } = useERC20("USDC")
  const { waitForTx } = useWaitTx()

  /**
   * User input. Amount of USDC willing to pay.
   */
  const [usdcInput, setUsdcInput] = useState<BigNumber>()
  const [debouncedUsdcInput] = useDebounce(usdcInput, 500)

  /**
   * Ratio: converts USDC to amount of SHER available for claim.
   */
  const [usdcToSherRewardRatio, setUsdcToSherRewardRatio] = useState<number>()

  /**
   * Fundraise deadline. USDC payments won't be accepted afterwards.
   */
  const [deadline, setDeadline] = useState<Date>()
  /**
   * Amount of SHER left in SherBuy contract, available for sale during the fundraise.
   */
  const [sherRemaining, setSherRemaining] = useState<ethers.BigNumber>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoadingRewards, setIsLoadingRewards] = useState(false)

  /**
   * These rewards are calculated based on how much USDC the user is willing to contribute.
   */
  const [rewards, setRewards] = useState<Rewards>()

  /**
   * Fetch ratio to convert between USDC and SHER.
   */
  useEffect(() => {
    const fetchConversionRatio = async () => {
      try {
        const ratio = await sherBuyContract.getUsdcToSherRewardRatio
        setUsdcToSherRewardRatio(ratio)
      } catch (error) {
        console.error(error)
      }
    }

    fetchConversionRatio()
  }, [sherBuyContract, setUsdcToSherRewardRatio])

  /**
   * Fetch fundraise event deadline.
   */
  useEffect(() => {
    const fetchDeadlineData = async () => {
      try {
        const deadline = await sherClaimContract.getClaimableAt()
        setDeadline(deadline)
      } catch (error) {
        console.error(error)
      }
    }

    fetchDeadlineData()
  }, [sherClaimContract])

  /**
   * Fetch amount of SHER remaining.
   */
  useEffect(() => {
    const fetchAmountRemaining = async () => {
      try {
        const sherAmount = await sher.getBalanceOf(sherBuyContract.address)
        setSherRemaining(sherAmount)
      } catch (error) {
        console.error(error)
      }
    }

    fetchAmountRemaining()
  }, [sher, sherBuyContract.address, setSherRemaining])

  /**
   * Calculate rewards when debounced usdcInput changes (user stopped writing).
   */
  useEffect(() => {
    const calculateRewards = async () => {
      if (!debouncedUsdcInput || !usdcToSherRewardRatio || debouncedUsdcInput.isZero()) {
        setRewards(undefined)
        return
      }

      setIsLoadingRewards(true)

      try {
        // From USDC to SHER (6 to 18 decimals) is 10**12
        // But ratio is 0.1, (1 USDC == 0.1 SHER)
        // So 10**11 for direct conversion
        const sherAmountWantedAsBigNumber = debouncedUsdcInput.mul(10 ** 11)

        const { sherAmount, stake, price } = await sherBuyContract.getCapitalRequirements(sherAmountWantedAsBigNumber)

        setRewards({
          sherAmount,
          stake,
          price,
        })
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoadingRewards(false)
      }
    }
    calculateRewards()
  }, [debouncedUsdcInput, setIsLoadingRewards, usdcToSherRewardRatio, setRewards, sherBuyContract])

  const handleUsdcChange = (value: BigNumber | undefined) => {
    if (!value) {
      setRewards(undefined)
    }

    setUsdcInput(value)
  }

  const handleExecute = async () => {
    if (!rewards?.sherAmount) return

    try {
      await waitForTx(async () => await sherBuyContract.execute(rewards?.sherAmount), {
        transactionType: TxType.EXECUTE,
      })
      navigate("/fundraiseclaim")
    } catch (error) {
      console.error(error)
    }
  }

  const eventEndsString = useMemo(() => {
    return deadline && formattedTimeDifference(deadline, ["days", "hours", "minutes"])
  }, [deadline])

  const usdcRemaining = sherRemaining && sherRemaining.div(10 ** 11)
  const usdcRemainingRounded = usdcRemaining && usdcRemaining.sub(usdcRemaining.mod(1e6)) //sherRemaining && sherRemaining.div(10 ** 11)

  return (
    <Box>
      <LoadingContainer loading={isLoadingRewards}>
        <Column spacing="m">
          <Row>
            <Title>Participate</Title>
          </Row>
          <Row alignment="space-between">
            <Column>
              <Text>Event Ends</Text>
            </Column>
            <Column>
              <Text strong>{eventEndsString}</Text>
            </Column>
          </Row>
          <Row alignment="space-between">
            <Column>
              <Text>Participation Remaining</Text>
            </Column>
            <Column>
              <Text strong>
                {usdcRemainingRounded && utils.commify(utils.formatUnits(usdcRemainingRounded, 6))} USDC
              </Text>
            </Column>
          </Row>
          <Row className={styles.rewardsContainer}>
            <Column grow={1} spacing="l">
              <TokenInput onChange={handleUsdcChange} token="USDC" placeholder="Choose amount" balance={usdcBalance} />
              {rewards && (
                <Row>
                  <Column grow={1} spacing="m">
                    <Row alignment="space-between">
                      <Column>
                        <Text>Staking (6 months)</Text>
                      </Column>
                      <Column>
                        <Text variant="mono">{utils.commify(utils.formatUnits(rewards.stake, 6))} USDC</Text>
                      </Column>
                    </Row>
                    <Row alignment="space-between">
                      <Column>
                        <Text>Treasury Contribution</Text>
                      </Column>
                      <Column>
                        <Text variant="mono">{utils.commify(utils.formatUnits(rewards.price, 6))} USDC</Text>
                      </Column>
                    </Row>
                    <Row>
                      <hr />
                    </Row>
                    <Row alignment="space-between">
                      <Column>
                        <Text strong>SHER Reward</Text>
                      </Column>
                      <Column className={styles.strong}>
                        <Text strong>{`${utils.commify(utils.formatUnits(rewards.sherAmount, 18))} SHER`}</Text>
                      </Column>
                    </Row>
                    <Row alignment="center">
                      <ConnectGate>
                        <AllowanceGate
                          spender={sherBuyContract.address}
                          amount={usdcInput ?? BigNumber.from(0)}
                          render={(disabled) => (
                            <Button disabled={disabled} onClick={handleExecute}>
                              Execute
                            </Button>
                          )}
                        ></AllowanceGate>
                      </ConnectGate>
                    </Row>
                  </Column>
                </Row>
              )}
            </Column>
          </Row>
        </Column>
      </LoadingContainer>
    </Box>
  )
}
