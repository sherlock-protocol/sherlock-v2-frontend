import React, { useCallback, useEffect, useState } from "react"
import { ethers, utils } from "ethers"
import { useSherBuyContract } from "../../hooks/useSherBuyContract"

type Rewards = {
  sherAmount: ethers.BigNumber
  stake: ethers.BigNumber
  price: ethers.BigNumber
}

export const FundraisingPage: React.FC = () => {
  const sherBuyContract = useSherBuyContract()

  const [usdcInput, setUsdcInput] = useState<number>()
  const [usdcSherRatio, setUsdcSherRatio] = useState<number>()
  const [isLoadingRewards, setIsLoadingRewards] = useState(false)
  const [rewards, setRewards] = useState<Rewards>()

  useEffect(() => {
    const fetchConversionRatio = async () => {
      try {
        const stakeRate = await sherBuyContract.stakeRate()
        const buyRate = await sherBuyContract.buyRate()

        const stakeRatio = Number(utils.formatUnits(stakeRate, 6))
        const buyRatio = Number(utils.formatUnits(buyRate, 6))

        const ratio = buyRatio / (stakeRatio + buyRatio)
        setUsdcSherRatio(ratio)
      } catch (error) {
        console.error(error)
      }
    }

    fetchConversionRatio()
  }, [sherBuyContract, setUsdcSherRatio])

  const handleCalculateRewards = useCallback(async () => {
    if (!usdcInput || !usdcSherRatio) return

    setIsLoadingRewards(true)

    try {
      const sherAmountWanted = usdcInput * usdcSherRatio
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
  }, [usdcInput, usdcSherRatio, sherBuyContract])

  const handleUsdcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsdcInput(e.target.valueAsNumber)
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}>
        <h1>FUNDRAISING</h1>
        <input type="number" placeholder="USDC" value={usdcInput ?? ""} onChange={handleUsdcChange} />
        <button onClick={handleCalculateRewards}>Calculate rewards</button>
        {isLoadingRewards && <span>Calculating rewards ...</span>}
        {rewards && (
          <div>
            <ul>
              <li>{`USDC Stake (6 months): ${utils.formatUnits(rewards.stake, 6)}`}</li>
              <li>{`USDC Contributed: ${utils.formatUnits(rewards.price, 6)}`}</li>
              <li>{`SHER Reward: ${utils.formatUnits(rewards.sherAmount, 18)} tokens`}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
