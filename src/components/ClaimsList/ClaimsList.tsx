import React from "react"
import { Box } from "../Box"
import { Column, Row } from "../Layout"
import { Title } from "../Title"
import { Text } from "../Text"
import { formatAmount } from "../../utils/format"
import styles from "./ClaimsList.module.scss"
import cx from "classnames"

type Claim = {
  id: number
  protocol: string
  date: string
  coverageAgreementUrl: string
  evidenceUrl?: string
  amount: number
  txHashUrl: string
  status: "paid" | "denied"
}

const CLAIMS: Claim[] = [
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
    status: "paid",
  },
  {
    id: 2,
    protocol: "Sentiment",
    date: "April 7, 2023",
    coverageAgreementUrl:
      "https://github.com/sherlock-protocol/sherlock-reports/blob/588192a19aef3180fa302e9ae10e8c29d7c7f044/coverage-agreements/Sentiment%20Coverage%20Agreement%20(Revised%202023.2.17).pdf",
    evidenceUrl:
      "https://sherlock-files.ams3.digitaloceanspaces.com/claims/Sentiment_0x5af5b22283e35ef9d9d4a32753014cdc40fd7a5a5d920d83d2c1e901c10a0a7c_16977102.pdf?hash=f513422f0d98aaac6f669142caf9148172ca7f2a17559f3c1cb26177df11e8ef",
    amount: 65_701,
    txHashUrl: "https://etherscan.io/tx/0xe67bbb7a9085f1a603fcea1eefe08c7674a2f504e81f6d69df41c8b077c2765e",
    status: "paid",
  },
  {
    id: 3,
    protocol: "Ajna",
    date: "Sept 26, 2023",
    coverageAgreementUrl:
      "https://github.com/sherlock-protocol/sherlock-reports/blob/main/coverage-agreements/Ajna%20Coverage%20Agreement%202023.07.15.pdf",
    amount: 49_500,
    txHashUrl: "https://etherscan.io/tx/0xa4a8fbea2c24662ea46e25ab3ab69456a8327463803c4851948c2ba2234fed5f",
    status: "paid",
  },
]

function getStatusLabel(status: "paid" | "denied") {
  switch (status) {
    case "paid":
      return "Paid"
    case "denied":
      return "Denied"
  }
}

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
                <Text strong>Status</Text>
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
                    {item.evidenceUrl ? (
                      <Text>
                        <a href={item.evidenceUrl} target="_blank" rel="noopener noreferrer">
                          Link
                        </a>
                      </Text>
                    ) : (
                      <Text variant="secondary">-</Text>
                    )}
                  </Column>
                  <Column alignment="center" className={cx(styles.listColumn, styles.entry, styles.link)}>
                    <Text>
                      <a href={item.txHashUrl} target="_blank" rel="noopener noreferrer">
                        {getStatusLabel(item.status)}
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
