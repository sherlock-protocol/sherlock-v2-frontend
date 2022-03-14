import React, { useEffect } from "react"
import { useAccount } from "wagmi"

import StakingPosition from "../StakingPosition/StakingPosition"

import { useStakingPositions } from "../../hooks/api/useStakingPositions"

import styles from "./StakingPositionsList.module.scss"
import { BigNumber } from "ethers"
import { Title } from "../Title"
import { Column } from "../Layout"
import { Button } from "../Button/Button"
import { useNavigate } from "react-router-dom"

export const StakingPositionsList: React.FC = () => {
  const [{ data: accountData }] = useAccount()
  const { getStakingPositions, data, loading } = useStakingPositions()
  const navigate = useNavigate()

  useEffect(() => {
    if (accountData?.address) {
      getStakingPositions(accountData.address)
    }
  }, [accountData?.address, getStakingPositions])

  const handleGoToStaking = React.useCallback(() => {
    navigate("/")
  }, [navigate])

  if (!data) return null

  return (
    <div className={styles.container}>
      {data.positions.map((position) => (
        <StakingPosition
          key={position.id.toString()}
          id={BigNumber.from(position.id)}
          usdcBalance={position.usdc}
          sherRewards={position.sher}
          lockupEnd={position.lockupEnd}
          apy={data?.usdcAPY}
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
