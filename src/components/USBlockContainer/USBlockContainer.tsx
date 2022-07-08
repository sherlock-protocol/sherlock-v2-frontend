import React, { PropsWithChildren } from "react"
import useIsUSA from "../../hooks/useIsUSA"
import { Column } from "../Layout"
import { Text } from "../Text"
import { Title } from "../Title"
import styles from "./USBlockContainer.module.scss"

const USBlockContainer: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const isUSA = useIsUSA()

  if (!isUSA) {
    return <>{children}</>
  }

  return (
    <div className={styles.container}>
      <Column spacing="l">
        <Title>Service Not Available in Your Region</Title>
        <Text>
          Staking is not available to people or companies who are residents of, or are located, incorporated, or have a
          registered agent in the United States.
        </Text>
      </Column>
    </div>
  )
}

export default USBlockContainer
