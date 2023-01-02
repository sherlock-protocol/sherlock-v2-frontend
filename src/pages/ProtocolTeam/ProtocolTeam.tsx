import { Box } from "../../components/Box"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { Column, Row } from "../../components/Layout"
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"

export const ProtocolTeam = () => {
  return (
    <LoadingContainer>
      <Column spacing="xl">
        <Box shadow={false}>
          <Column spacing="m">
            <Title variant="h2">TEAM</Title>
            <Text>Add your team's Github and Discord handles.</Text>
          </Column>
        </Box>
        <Box shadow={false}>
          <Column spacing="m">
            <Title variant="h2">GITHUB HANDLES</Title>
            <Row spacing="m">
              <Input />
              <Button>Add</Button>
            </Row>
          </Column>
        </Box>
        <Box shadow={false}>
          <Column spacing="m">
            <Title variant="h2">DISCORD HANDLES</Title>
            <Row spacing="m">
              <Input />
              <Button>Add</Button>
            </Row>
          </Column>
        </Box>
      </Column>
    </LoadingContainer>
  )
}
