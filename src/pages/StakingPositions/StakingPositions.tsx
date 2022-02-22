import React from "react"
import ConnectGate from "../../components/ConnectGate/ConnectGate"
import { StakingPositionsList } from "../../components/StakingPositionsList/StakingPositionsList"
import styles from "./StakingPositions.module.scss"

export const StakingPositionsPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <ConnectGate>
        <StakingPositionsList />
      </ConnectGate>
    </div>
  )
}
