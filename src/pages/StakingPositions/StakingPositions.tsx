import React from "react"
import ConnectGate from "../../components/ConnectGate/ConnectGate"
import Loading from "../../components/Loading/Loading"
import { StakingPositionsList } from "../../components/StakingPositionsList/StakingPositionsList"
import styles from "./StakingPositions.module.scss"

export const StakingPositionsPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <Loading label="Loading..." />
      {/* <ConnectGate> */}
      {/* <StakingPositionsList />
      </ConnectGate> */}
    </div>
  )
}
