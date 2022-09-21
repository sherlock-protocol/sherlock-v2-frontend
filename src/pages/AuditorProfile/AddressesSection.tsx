import { FaTrash, FaPlusSquare } from "react-icons/fa"

import { Box } from "../../components/Box"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { Table, TBody, Td, Tr } from "../../components/Table/Table"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { useProfile } from "../../hooks/api/auditors"

export const AddressesSection = () => {
  const { data: profile } = useProfile()

  if (!profile) return null

  return (
    <Box shadow={false}>
      <Title variant="h2">Addresses</Title>
      <Table selectable={false}>
        <TBody>
          {profile.addresses.map((address) => (
            <Tr key={address.id}>
              <Td>
                <Text variant="mono">{address.address}</Text>
              </Td>
              <Td>
                <Button size="small" variant="secondary">
                  <FaTrash />
                </Button>
              </Td>
            </Tr>
          ))}
          <Tr>
            <Td>
              <Input variant="secondary" placeholder="Add new address ..." />
            </Td>
            <Td>
              <Button size="small" variant="secondary">
                <FaPlusSquare />
              </Button>
            </Td>
          </Tr>
        </TBody>
      </Table>
    </Box>
  )
}
