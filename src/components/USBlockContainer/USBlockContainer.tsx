import React, { PropsWithChildren } from "react"
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
        <Title>US Forbidden</Title>
        <Text>
          Sherlock may not be offered or sold in the United States, to U.S. persons, for the account or benefit of a
          U.S. person or in any jurisdiction in which such offer would be prohibited.
        </Text>
      </Column>
    </div>
  )
}

export default USBlockContainer
