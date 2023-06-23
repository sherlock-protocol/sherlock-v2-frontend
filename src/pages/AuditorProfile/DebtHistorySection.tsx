import React from "react"
import { FaExternalLinkAlt } from "react-icons/fa"

import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Table, TBody, THead, Td, Tr } from "../../components/Table/Table"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { useProfile } from "../../hooks/api/auditors/useProfile"
import { useDebtHistory, Debt } from "../../hooks/api/auditors/useDebtHistory"
import { FiArrowUpRight, FiArrowDownLeft } from "react-icons/fi"
import { DateTime } from "luxon"
import styles from "./DebtHistorySection.module.scss"

type ItemProps = {
  item: Debt
}

const DebtIncreaseItem: React.FC<ItemProps> = React.memo(({ item }) => (
  <>
    <Td width={20}>
      <FiArrowUpRight size={24} color="#FF4136" />
    </Td>
    <Td>
      <Column spacing="xs">
        <Text strong>{item.escalationUrl ? "Rejected escalation" : "Invalid issues penalty"}</Text>
        {item.escalationUrl && (
          <Text>
            <a href={item.escalationUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
              <Row>
                <Text>Escalation link</Text>
                <FaExternalLinkAlt />
              </Row>
            </a>
          </Text>
        )}
      </Column>
    </Td>
    <Td align="center">{item.contestTitle && <Text>{item.contestTitle}</Text>}</Td>
    <Td>
      <Column spacing="xs" alignment="center">
        <Text strong>{DateTime.fromJSDate(item.created_at).setLocale("en").toLocaleString(DateTime.DATE_MED)}</Text>
        <Text>{DateTime.fromJSDate(item.created_at).setLocale("en").toLocaleString(DateTime.TIME_SIMPLE)}</Text>
      </Column>
    </Td>
    <Td align="right">
      <Text variant="mono" strong>
        {item.amount} USDC
      </Text>
    </Td>
  </>
))

const DebtDecreaseItem: React.FC<ItemProps> = React.memo(({ item }) => (
  <>
    <Td width={20}>
      <FiArrowDownLeft size={24} color="#3D9970" />
    </Td>
    <Td>
      <Column spacing="xs">
        <Text strong>Paid from contest payout</Text>
      </Column>
    </Td>
    <Td align="center">{item.contestTitle && <Text>{item.contestTitle}</Text>}</Td>
    <Td>
      <Column spacing="xs" alignment="center">
        <Text strong>{DateTime.fromJSDate(item.created_at).setLocale("en").toLocaleString(DateTime.DATE_MED)}</Text>
        <Text>{DateTime.fromJSDate(item.created_at).setLocale("en").toLocaleString(DateTime.TIME_SIMPLE)}</Text>
      </Column>
    </Td>
    <Td align="right">
      <Text variant="mono" strong>
        {item.amount} USDC
      </Text>
    </Td>
  </>
))

export const DebtHistorySection = () => {
  const { data: profile } = useProfile()
  const { data: debtHistory } = useDebtHistory()

  const hasDebts = debtHistory && debtHistory?.length > 0

  return (
    <Box shadow={false} fullWidth>
      <Row alignment={["space-between", "center"]} spacing="m">
        <Column>
          <Title variant="h2">Debts</Title>
        </Column>
        <Column spacing="xs">
          <Text variant="normal">
            {!!profile?.outstandingDebt && profile?.outstandingDebt > 0
              ? `Outstanding debt: ${profile?.outstandingDebt} USDC`
              : "No outstanding debt"}
          </Text>
        </Column>
      </Row>
      {hasDebts ? (
        <Table selectable={false}>
          <THead>
            <Tr>
              <Td></Td>
              <Td>
                <Text>Description</Text>
              </Td>
              <Td align="center">Contest</Td>
              <Td align="center">Date</Td>
              <Td align="right">Amount</Td>
            </Tr>
          </THead>

          <TBody>
            {debtHistory?.map((item) => (
              <Tr key={item.id} className={styles.debtItem}>
                {item.type === "INCREASE" ? <DebtIncreaseItem item={item} /> : <DebtDecreaseItem item={item} />}
              </Tr>
            ))}
          </TBody>
        </Table>
      ) : (
        <Column alignment="center" className={styles.emptyListPlaceholder}>
          <Text variant="secondary">No debt entries</Text>
        </Column>
      )}
    </Box>
  )
}
