import React, { useEffect, useState } from "react"
import { BigNumber, ethers, utils } from "ethers"
import { useDebounce } from "use-debounce"
import cx from "classnames"

import AllowanceGate from "../../components/AllowanceGate/AllowanceGate"
import { Button } from "../../components/Button/Button"
import { Input } from "../../components/Input"
import { Box } from "../../components/Box"
import { Title } from "../../components/Title"
import { Column, Row } from "../../components/Layout"

import { useSherBuyContract } from "../../hooks/useSherBuyContract"
import { useSherClaimContract } from "../../hooks/useSherClaimContract"
import useERC20 from "../../hooks/useERC20"
import ConnectGate from "../../components/ConnectGate/ConnectGate"
import useWaitTx from "../../hooks/useWaitTx"

import styles from "./Fundraising.module.scss"

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

const millisecondsToHoursAndMinutes = (milliseconds: number): [number, number] => {
  const seconds = milliseconds / 1000
  const secondsInAnHour = 60 * 60
  const hours = Math.round(seconds / secondsInAnHour)
  const minutes = Math.round((seconds % secondsInAnHour) / 60)
  return [hours, minutes]
}

export const FundraisingPage: React.FC = () => {
  const sherBuyContract = useSherBuyContract()
  const sherClaimContract = useSherClaimContract()
  const sher = useERC20("SHER")
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
        const ratio = await sherBuyContract.getUsdcToSherRewardRatio()
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
        const sherAmountWanted = Number(ethers.utils.formatUnits(debouncedUsdcInput, 6)) * usdcToSherRewardRatio
        const sherAmountWantedAsBigNumber = ethers.utils.parseUnits(sherAmountWanted.toString(), 18)

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
      await waitForTx(async () => await sherBuyContract.execute(rewards?.sherAmount))
    } catch (error) {
      console.error(error)
    }
  }

  const formattedDeadline = deadline && millisecondsToHoursAndMinutes(deadline.getTime() - Date.now())
  const usdcRemaining =
    usdcToSherRewardRatio && sherRemaining && Number(utils.formatUnits(sherRemaining, 18)) / usdcToSherRewardRatio

  return (
    <Box>
      <Column spacing="m">
        <Row>
          <Title>Participate</Title>
        </Row>
        <Row alignment="space-between">
          <Column>Event Ends</Column>
          <Column>{formattedDeadline && `${formattedDeadline[0]} hours ${formattedDeadline[1]} minutes`}</Column>
        </Row>
        <Row alignment="space-between">
          <Column>Participation Remaining</Column>
          <Column>{usdcRemaining && utils.commify(usdcRemaining)}</Column>
        </Row>
        <Row className={styles.rewardsContainer}>
          <Column grow={1} spacing="l">
            <Row alignment={["space-between", "center"]} spacing="xl">
              <Column grow={1}>
                <Input onChange={handleUsdcChange} token="USDC" placeholder="Choose amount" />
              </Column>
              <Column grow={0} className={cx(styles.huge, styles.strong)}>
                USDC
              </Column>
            </Row>
            {rewards && (
              <Row>
                <Column grow={1} spacing="m">
                  <Row alignment="space-between">
                    <Column>USDC Stake (6 months)</Column>
                    <Column>{utils.commify(utils.formatUnits(rewards.stake, 6))}</Column>
                  </Row>
                  <Row alignment="space-between">
                    <Column>USDC Contributed</Column>
                    <Column>{utils.commify(utils.formatUnits(rewards.price, 6))}</Column>
                  </Row>
                  <Row>
                    <hr />
                  </Row>
                  <Row alignment="space-between">
                    <Column>USDC Contributed</Column>
                    <Column className={styles.strong}>
                      <strong>{`${utils.commify(utils.formatUnits(rewards.sherAmount, 18))} tokens`}</strong>
                    </Column>
                  </Row>
                  <Row alignment="space-between">
                    <Column>
                      <strong>SHER at $100M FDV</strong>
                    </Column>
                    <Column className={styles.strong}>
                      <strong>{utils.commify(utils.formatUnits(rewards.sherAmount, 18))}</strong>
                    </Column>
                  </Row>
                  <Row alignment="center">
                    <ConnectGate>
                      <AllowanceGate
                        spender={sherBuyContract.address}
                        amount={usdcInput ? utils.parseUnits(usdcInput.toString(), 6) : BigNumber.from(0)}
                      >
                        <Button onClick={handleExecute}>Execute</Button>
                      </AllowanceGate>
                    </ConnectGate>
                  </Row>
                </Column>
              </Row>
            )}
          </Column>
        </Row>
      </Column>
    </Box>
  )
}
