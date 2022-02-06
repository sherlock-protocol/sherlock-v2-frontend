import React from "react"
import StakingPosition from "../../components/StakingPosition/StakingPosition"
import styles from "./StakingPositions.module.scss"

export type StakingPositionsPageProps = {}

export const StakingPositionsPage: React.FC<StakingPositionsPageProps> = () => {
  return (
    <div className={styles.container}>
      {[1, 2, 3, 4, 5, 6].map((item, index) => (
        <StakingPosition key={item.toString()} id={item} />
      ))}
    </div>
  )
}
