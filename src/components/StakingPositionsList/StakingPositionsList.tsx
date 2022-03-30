import React, { useEffect } from "react"
import { useAccount } from "wagmi"

import StakingPositionItem from "../StakingPosition/StakingPosition"

import { StakingPosition, useStakingPositions } from "../../hooks/api/useStakingPositions"

import styles from "./StakingPositionsList.module.scss"
import { BigNumber } from "ethers"
import { Title } from "../Title"
import { Column } from "../Layout"
import { Button } from "../Button/Button"
import { useNavigate } from "react-router-dom"
import useInterval from "../../hooks/useInterval"

export const StakingPositionsList: React.FC = () => {
  const [{ data: accountData }] = useAccount()
  const { getStakingPositions, data, loading } = useStakingPositions()
  const [positions, setPositions] = React.useState<Array<StakingPosition>>([])
  const navigate = useNavigate()

  /**
   * Setup USDC real-time update
   */
  const handleSetupUSDCUpdate = React.useCallback(() => {
    if (!data?.positions || !data?.usdcLastUpdated) {
      return
    }

    // Initialize scaled USDC balance, to be used for
    // real-time balance updates.
    // Also, compensate for the gap between now and
    // indexer's last update time.
    const diff = Math.floor((new Date().valueOf() - data?.usdcLastUpdated.valueOf()) / 1000)
    const updatedPositions = data?.positions?.map((item) => {
      const delta = BigNumber.from(item?.scaledUsdcIncrement ?? 0).mul(diff)
      const scaledUsdc = item.usdc.mul(1e6).add(delta)

      return {
        ...item,
        scaledUsdc,
        usdc: scaledUsdc.div(1e6),
      }
    })

    setPositions(updatedPositions)
  }, [data?.positions, data?.usdcLastUpdated])

  /**
   * Trigger recomputing of accrued USDC balance on an interval.
   */
  useInterval(() => {
    setPositions(
      positions.map((item) => {
        const oldBalance = item.scaledUsdc
        const newBalanceScaled = oldBalance?.add(item.scaledUsdcIncrement ?? 0)
        const newBalance = newBalanceScaled?.div(1e6) as BigNumber

        return {
          ...item,
          usdc: newBalance,
          scaledUsdc: newBalanceScaled,
        }
      })
    )
  }, 1000)

  useEffect(() => {
    if (accountData?.address) {
      getStakingPositions(accountData.address)
    }
  }, [accountData?.address, getStakingPositions])

  useEffect(() => {
    if (positions.length > 0 || !data?.positions) {
      return
    }

    handleSetupUSDCUpdate()
  }, [data?.positions, positions, handleSetupUSDCUpdate])

  const handleGoToStaking = React.useCallback(() => {
    navigate("/")
  }, [navigate])

  if (!data) return null

  return (
    <div className={styles.container}>
      {positions.map((position) => (
        <StakingPositionItem
          key={position.id.toString()}
          id={BigNumber.from(position.id)}
          usdcBalance={position.usdc}
          sherRewards={position.sher}
          lockupEnd={position.lockupEnd}
          apy={position?.usdcAPY ?? data?.usdcAPY}
        />
      ))}
      {!loading && data?.positions?.length === 0 && (
        <Column spacing="m">
          <Title>No active positions found.</Title>
          <Button onClick={handleGoToStaking}>Go to Staking</Button>
        </Column>
      )}
    </div>
  )
}
