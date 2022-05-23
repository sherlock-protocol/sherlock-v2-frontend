import React from "react"
import { Column } from "../../components/Layout"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import styles from "./MobileBlock.module.scss"
import { ReactComponent as Logotype } from "../../assets/icons/logotype.svg"

const MobileBlock: React.FC = () => {
  return (
    <div className={styles.container}>
      <Column spacing="xl">
        <Logotype height={60} width={60} />
        <Title>We are sorry...</Title>
        <Column spacing="m">
          <Text>Currently, we do not support mobile clients.</Text>
          <Text>Sherlock can be accessed via any desktop device.</Text>
        </Column>
      </Column>
    </div>
  )
}
export default MobileBlock
