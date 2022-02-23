import React, { useEffect } from "react"
import { useAccount } from "wagmi"

import StakingPosition from "../StakingPosition/StakingPosition"

import { useStakingPositions } from "../../hooks/api/useStakingPositions"

import styles from "./StakingPositionsList.module.scss"
import { BigNumber } from "ethers"

export const StakingPositionsList: React.FC = () => {
  const [{ data: accountData }] = useAccount()
  const { getStakingPositions, data } = useStakingPositions()

  useEffect(() => {
    if (accountData?.address) {
      getStakingPositions(accountData.address)
    }
  }, [accountData?.address, getStakingPositions])

  if (!data) return null

  return (
    <div className={styles.container}>
      {data.positions.map((position) => (
        <StakingPosition
          key={position.id.toString()}
          id={BigNumber.from(position.id)}
          usdcBalance={position.usdc}
          sherRewards={position.sher}
          lockupEnd={BigNumber.from(position.lockupEnd.getTime())}
        />
      ))}
    </div>
  )
}
