import React from "react"
import { Box } from "../Box"
import { Column, Row } from "../Layout"
import { Title } from "../Title"
import { Text } from "../Text"
import { formatAmount } from "../../utils/format"
import styles from "./ClaimsList.module.scss"
import cx from "classnames"

const CLAIMS = [
  {
    id: 1,
    protocol: "Euler",
    date: "March 13, 2023",
    coverageAgreementUrl:
      "https://github.com/sherlock-protocol/sherlock-reports/blob/588192a19aef3180fa302e9ae10e8c29d7c7f044/coverage-agreements/Euler%20Coverage%20Agreement%20(Revised%202022.10.19).pdf",
    evidenceUrl:
      "https://sherlock-files.ams3.digitaloceanspaces.com/claims/Euler_0x3019e52a670390f24e4b9b58af62a7367658e457bbb07f86b19b213ec74b5be7_16817996.pdf?hash=d6c8e864a5312384143a21f542e998f6e83357f5b8e3e34ccdcb551404d25c09",
    amount: 4_529_285,
    txHashUrl: "https://etherscan.io/tx/0x234cd8e369fdcd0387ada4214e563a6a72aad4abd0b464a2873f3eb9dac2579b",
  },
]

/**
 * List of past claims
 */
const ClaimsList: React.FC = () => {
  return (
    <Box shadow={false} fullWidth>
      <Column spacing="m">
        <Row>
          <Title variant="h3">CLAIMS</Title>
        </Row>
        <Row>
          <Title>{CLAIMS.length}</Title>
        </Row>
        <Row alignment="center">
          <Column grow={1} spacing="xs">
            <Row className={styles.header}>
              <Column className={styles.listColumn}>
                <Text strong>Protocol</Text>
              </Column>
              <Column alignment="center" className={styles.listColumn}>
                <Text strong>Date</Text>
              </Column>
              <Column alignment="center" className={styles.listColumn}>
                <Text strong>Amount</Text>
              </Column>
              <Column alignment="center" className={styles.listColumn}>
                <Text strong>Coverage Agreement</Text>
              </Column>
              <Column alignment="center" className={styles.listColumn}>
                <Text strong>Evidence</Text>
              </Column>
              <Column alignment="center" className={cx(styles.listColumn, styles.link)}>
                <Text strong>Transaction</Text>
              </Column>
            </Row>
            <Column grow={1} spacing="xs" className={styles.listContainer}>
              {CLAIMS?.map((item) => (
                <Row key={item.id.toString()}>
                  <Column className={cx(styles.listColumn, styles.entry)}>
                    <Text strong className={styles.protocolName}>
                      {item.protocol}
                    </Text>
                  </Column>
                  <Column alignment="center" className={cx(styles.listColumn, styles.entry)}>
                    <Text>{item.date}</Text>
                  </Column>
                  <Column alignment="center" className={cx(styles.listColumn, styles.entry)}>
                    <Text>${formatAmount(item.amount, 0)}</Text>
                  </Column>
                  <Column alignment="center" className={cx(styles.listColumn, styles.entry, styles.link)}>
                    <Text>
                      <a href={item.coverageAgreementUrl} target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </Text>
                  </Column>
                  <Column alignment="center" className={cx(styles.listColumn, styles.entry, styles.link)}>
                    <Text>
                      <a href={item.evidenceUrl} target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </Text>
                  </Column>
                  <Column alignment="center" className={cx(styles.listColumn, styles.entry, styles.link)}>
                    <Text>
                      <a href={item.txHashUrl} target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </Text>
                  </Column>
                </Row>
              ))}
              {/* {tvl && (
                <Row className={styles.header}>
                  <Column className={styles.listColumn}>
                    <Text strong>Total Value Covered</Text>
                  </Column>
                  <Column alignment="end" className={styles.listColumn}>
                    <Text>${formatAmount(ethers.utils.formatUnits(tvc, 6), 0)}</Text>
                  </Column>
                  <Column className={styles.listColumn} grow={1}></Column>
                  <Column className={styles.listColumn}></Column>
                </Row>
              )} */}
            </Column>
          </Column>
        </Row>
      </Column>
    </Box>
  )
}

export default ClaimsList
