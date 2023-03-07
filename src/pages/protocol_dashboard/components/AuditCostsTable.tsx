import { commify } from "ethers/lib/utils.js"
import { Table, TBody, Tr, Td } from "../../../components/Table/Table"
import { Text } from "../../../components/Text"

type AuditCosts = {
  prizePool: number
  leadSeniorAuditorFixedPay: number
  judgingPrizePool: number
  sherlockFee: number
}

export const AuditsCostTable: React.FC<{ auditCosts: AuditCosts }> = ({ auditCosts }) => {
  return (
    <Table size="small">
      <TBody>
        <Tr>
          <Td>
            <Text strong>Audit contest prize pool</Text>
          </Td>
          <Td>{`${commify(auditCosts.prizePool)} USDC`}</Td>
        </Tr>
        <Tr>
          <Td>
            <Text strong>Lead Senior Watson fixed pay</Text>
          </Td>
          <Td>{`${commify(auditCosts.leadSeniorAuditorFixedPay)} USDC`}</Td>
        </Tr>
        <Tr>
          <Td>
            <Text strong>Judging contest prize pool</Text>
          </Td>
          <Td>{`${commify(auditCosts.judgingPrizePool)} USDC`}</Td>
        </Tr>
        <Tr>
          <Td>
            <Text strong>Sherlock's admin fee</Text>
          </Td>
          <Td>{`${commify(auditCosts.sherlockFee)} USDC`}</Td>
        </Tr>
      </TBody>
    </Table>
  )
}
