import React, { useCallback, useEffect, useState } from "react"
import { BigNumber, ethers, utils } from "ethers"

import AllowanceGate from "../../components/AllowanceGate/AllowanceGate"
import { Button } from "../../components/Button/Button"
import { Input } from "../../components/Input"
import { Box } from "../../components/Box"

import { useSherBuyContract } from "../../hooks/useSherBuyContract"
import { useSherClaimContract } from "../../hooks/useSherClaimContract"
import useERC20 from "../../hooks/useERC20"
import ConnectGate from "../../components/ConnectGate/ConnectGate"
import useWaitTx from "../../hooks/useWaitTx"

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

  const handleCalculateRewards = useCallback(async () => {
    if (!usdcInput || !usdcToSherRewardRatio) return

    setIsLoadingRewards(true)

    try {
      const sherAmountWanted = Number(ethers.utils.formatUnits(usdcInput, 6)) * usdcToSherRewardRatio
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
  }, [usdcInput, usdcToSherRewardRatio, sherBuyContract])

  const handleUsdcChange = (value: BigNumber) => {
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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h1>FUNDRAISING</h1>
        {formattedDeadline && <h2>{`Event ends: ${formattedDeadline[0]} hours ${formattedDeadline[1]} minutes`}</h2>}
        {usdcRemaining && <h2>{`USDC remaining: ${utils.commify(usdcRemaining)}`}</h2>}
        <Input value={usdcInput} onChange={handleUsdcChange} token="USDC" />
        <Button onClick={handleCalculateRewards}>Calculate rewards</Button>
        {isLoadingRewards && <span>Calculating rewards ...</span>}
        {rewards && (
          <div>
            <ul>
              <li>{`USDC Stake (6 months): ${utils.commify(utils.formatUnits(rewards.stake, 6))}`}</li>
              <li>{`USDC Contributed: ${utils.commify(utils.formatUnits(rewards.price, 6))}`}</li>
              <li>{`SHER Reward: ${utils.commify(utils.formatUnits(rewards.sherAmount, 18))} tokens`}</li>
            </ul>
            <ConnectGate>
              <AllowanceGate
                spender={sherBuyContract.address}
                amount={usdcInput ? utils.parseUnits(usdcInput.toString(), 6) : BigNumber.from(0)}
              >
                <Button onClick={handleExecute}>Execute</Button>
              </AllowanceGate>
            </ConnectGate>
          </div>
        )}
      </div>
    </Box>
  )
}
