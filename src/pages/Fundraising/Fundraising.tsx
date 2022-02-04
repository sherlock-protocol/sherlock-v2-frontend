import React, { useCallback, useEffect, useState } from "react"
import { BigNumber, ethers, utils } from "ethers"

import AllowanceGate from "../../components/AllowanceGate/AllowanceGate"
import { Button } from "../../components/Button/Button"

import { useSherBuyContract } from "../../hooks/useSherBuyContract"
import { useSherClaimContract } from "../../hooks/useSherClaimContract"
import useERC20 from "../../hooks/useERC20"

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
  const { getAllowance: getUSDCAllowance, approve: approveSpendUSDC } = useERC20("USDC")
  const sher = useERC20("SHER")

  /**
   * User input. Amount of USDC willing to pay.
   */
  const [usdcInput, setUsdcInput] = useState<number>()

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
   * Keep track of SherBuy's contract allowance to spend USDC
   */
  const [allowance, setAllowance] = useState<BigNumber>()

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
        const deadlineTimestamp = await sherClaimContract.claimableAt()
        setDeadline(new Date(deadlineTimestamp.mul(1000).toNumber()))
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
   * Refresh allowance from ERC20 contract
   */
  const refreshUSDCAllowance = useCallback(async () => {
    const _allowance = await getUSDCAllowance(sherBuyContract.address, true)
    setAllowance(_allowance)
  }, [setAllowance, sherBuyContract.address, getUSDCAllowance])

  /**
   * Fetch USDC allowance
   */
  useEffect(() => {
    if (!!allowance) {
      return
    }

    refreshUSDCAllowance()
  }, [allowance, refreshUSDCAllowance])

  const handleCalculateRewards = useCallback(async () => {
    if (!usdcInput || !usdcToSherRewardRatio) return

    setIsLoadingRewards(true)

    try {
      const sherAmountWanted = usdcInput * usdcToSherRewardRatio
      const { sherAmount, stake, price } = await sherBuyContract.getCapitalRequirements(
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

  const handleExecute = async () => {
    if (!rewards?.sherAmount) return

    try {
      const tx = await sherBuyContract.execute(rewards?.sherAmount)
      await tx.wait()
    } catch (error) {
      console.error(error)
    }
  }

  const handleUSDCApprove = async () => {
    if (!usdcInput) return

    const tx = await approveSpendUSDC(sherBuyContract.address, ethers.utils.parseUnits(usdcInput.toString(), 6))
    await tx?.wait()

    refreshUSDCAllowance()
  }

  const formattedDeadline = deadline && millisecondsToHoursAndMinutes(deadline.getTime() - Date.now())
  const usdcRemaining =
    usdcToSherRewardRatio && sherRemaining && Number(utils.formatUnits(sherRemaining, 18)) / usdcToSherRewardRatio

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
            <AllowanceGate
              allowance={allowance}
              spender={sherBuyContract.address}
              amount={usdcInput ? utils.parseUnits(usdcInput.toString(), 6) : BigNumber.from(0)}
              onApprove={handleUSDCApprove}
            >
              <Button onClick={handleExecute}>Execute</Button>
            </AllowanceGate>
          </div>
        )}
      </div>
    </div>
  )
}
