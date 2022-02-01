import React, { useCallback, useEffect, useState } from "react"
import { ethers, utils } from "ethers"
import { useSherBuyContract } from "../../hooks/useSherBuyContract"
import { useSherTokenContract } from "../../hooks/useSherTokenContract"
import { useSherClaimContract } from "../../hooks/useSherClaimContract"

type Rewards = {
  sherAmount: ethers.BigNumber
  stake: ethers.BigNumber
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
  const sherTokenContract = useSherTokenContract()

  const [usdcInput, setUsdcInput] = useState<number>()
  const [usdcToSherRewardRatio, setUsdcToSherRewardRatio] = useState<number>()
  const [sherToUsdcRatio, setSherToUsdcRatio] = useState<number>()

  const [isLoadingRewards, setIsLoadingRewards] = useState(false)
  const [rewards, setRewards] = useState<Rewards>()
  const [deadline, setDeadline] = useState<Date>()
  const [sherRemaining, setSherRemaining] = useState<ethers.BigNumber>()

  useEffect(() => {
    const fetchConversionRatio = async () => {
      try {
        const stakeRate = await sherBuyContract.stakeRate()
        const buyRate = await sherBuyContract.buyRate()

        const stakeRatio = Number(utils.formatUnits(stakeRate, 6))
        const buyRatio = Number(utils.formatUnits(buyRate, 6))

        setUsdcToSherRewardRatio(buyRatio / (stakeRatio + buyRatio))
        setSherToUsdcRatio(stakeRatio + buyRatio)
      } catch (error) {
        console.error(error)
      }
    }

    fetchConversionRatio()
  }, [sherBuyContract, setUsdcToSherRewardRatio])

  useEffect(() => {
    const fetchDeadlineData = async () => {
      try {
        const deadlineTimestamp = await sherClaimContract.claimableAt()
        console.log(deadlineTimestamp.toString())
        setDeadline(new Date(deadlineTimestamp.mul(1000).toNumber()))
      } catch (error) {
        console.error(error)
      }
    }

    fetchDeadlineData()
  }, [sherClaimContract])

  useEffect(() => {
    const fetchAmountRemaining = async () => {
      try {
        const sherAmount = await sherTokenContract.balanceOf(sherBuyContract.address)
        setSherRemaining(sherAmount)
      } catch (error) {
        console.error(error)
      }
    }

    fetchAmountRemaining()
  }, [sherTokenContract, sherBuyContract.address, setSherRemaining])

  const handleCalculateRewards = useCallback(async () => {
    if (!usdcInput || !usdcToSherRewardRatio) return

    setIsLoadingRewards(true)

    try {
      const sherAmountWanted = usdcInput * usdcToSherRewardRatio
      const { sherAmount, stake, price } = await sherBuyContract.viewCapitalRequirements(
        utils.parseUnits(sherAmountWanted.toString(), 18)
      )

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

  const handleUsdcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsdcInput(e.target.valueAsNumber)
  }

  const formattedDeadline = deadline && millisecondsToHoursAndMinutes(deadline.getTime() - Date.now())
  const usdcRemaining =
    sherToUsdcRatio && sherRemaining && Number(utils.formatUnits(sherRemaining, 18)) * sherToUsdcRatio

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}>
        <h1>FUNDRAISING</h1>
        {formattedDeadline && <h2>{`Event ends: ${formattedDeadline[0]} hours ${formattedDeadline[1]} minutes`}</h2>}
        {usdcRemaining && <h2>{`USDC remaining: ${utils.commify(usdcRemaining)}`}</h2>}
        <input type="number" placeholder="USDC" value={usdcInput ?? ""} onChange={handleUsdcChange} />
        <button onClick={handleCalculateRewards}>Calculate rewards</button>
        {isLoadingRewards && <span>Calculating rewards ...</span>}
        {rewards && (
          <div>
            <ul>
              <li>{`USDC Stake (6 months): ${utils.commify(utils.formatUnits(rewards.stake, 6))}`}</li>
              <li>{`USDC Contributed: ${utils.commify(utils.formatUnits(rewards.price, 6))}`}</li>
              <li>{`SHER Reward: ${utils.commify(utils.formatUnits(rewards.sherAmount, 18))} tokens`}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
