import React from "react"
import { Box } from "../../components/Box"
import { Column } from "../../components/Layout"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import styles from "./USForbidden.module.scss"

export const USForbiddenPage = () => {
  return (
    <div className={styles.container}>
      <Box>
        <Column spacing="xl">
          <Title>US Forbidden</Title>
          <Text size="small" className={styles.v1}>
            For the Sherlock V1, please see{" "}
            <a href="https://v1.sherlock.xyz" rel="noreferrer" target="_blank">
              https://v1.sherlock.xyz
            </a>
          </Text>
        </Column>
      </Box>
    </div>
  )
}
