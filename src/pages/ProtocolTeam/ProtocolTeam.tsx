import { useCallback, useState } from "react"
import cx from "classnames"
import { useParams } from "react-router-dom"
import { Box } from "../../components/Box"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { Column, Row } from "../../components/Layout"
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer"
import { Text } from "../../components/Text"
import { Title } from "../../components/Title"
import { useGithubHandles } from "../../hooks/api/protocols/useGithubHandles"
import { useDebounce } from "use-debounce"

import styles from "./ProtocolTeam.module.scss"
import { useValidateGithubHandle } from "../../hooks/useValidateGithubHandle"
import { FaDiscord, FaGithub } from "react-icons/fa"
import { useAddGithubHandle } from "../../hooks/api/protocols/useAddGithubHandle"
import { ErrorModal } from "../ContestDetails/ErrorModal"
import { useDiscordHandles } from "../../hooks/api/protocols/useDiscordHandles"
import { useAddDiscordHandle } from "../../hooks/api/protocols/useAddDiscordHandle"
import { useValidateDiscordHandle } from "../../hooks/api/auditors/useValidateDiscordHandle"

export const ProtocolTeam = () => {
  const { dashboardID } = useParams()

  const { data: githubMembers } = useGithubHandles(dashboardID)
  const { data: discordMembers } = useDiscordHandles(dashboardID)

  const [githubHandle, setGithubHandle] = useState("")
  const [debouncedGithubHandle] = useDebounce(githubHandle, 300)
  const [discordHandle, setDiscordHandle] = useState("")
  const [debouncedDiscordHandle] = useDebounce(discordHandle, 300)

  const { data: githubHanldleIsValid, isLoading: isValidatingGithubHandle } =
    useValidateGithubHandle(debouncedGithubHandle)
  const {
    data: discordValidation,
    isError: discordHandleValidationError,
    isLoading: isValidatingDiscordHandle,
  } = useValidateDiscordHandle(debouncedDiscordHandle)

  const {
    addGithubHandle,
    isLoading: addGithubHandleIsLoading,
    error: addGithubHandleError,
    reset: resetAddGithubHandle,
  } = useAddGithubHandle()
  const {
    addDiscordHandle,
    isLoading: addDiscordHandleIsLoading,
    error: addDiscordHandleError,
    reset: resetAddDiscordHandle,
  } = useAddDiscordHandle()

  const handleGithubHandleClick = useCallback((handle: string) => {
    window.open(`https://github.com/${handle}`, "blank")
  }, [])

  const handleDiscordHandleClick = useCallback((discordID: number) => {
    window.open(`https://discordapp.com/users/${discordID}`)
  }, [])

  const handleAddGithubHandleClick = useCallback(() => {
    addGithubHandle({
      protocolDashboardID: dashboardID ?? "",
      handle: debouncedGithubHandle,
    })
    setGithubHandle("")
  }, [addGithubHandle, debouncedGithubHandle, dashboardID])

  const handleAddDiscordHandleClick = useCallback(() => {
    addDiscordHandle({
      protocolDashboardID: dashboardID ?? "",
      handle: discordHandle,
    })
    setDiscordHandle("")
  }, [addDiscordHandle, discordHandle, dashboardID])

  const handleErrorModalClose = useCallback(() => {
    resetAddGithubHandle()
    resetAddDiscordHandle()
  }, [resetAddGithubHandle, resetAddDiscordHandle])

  return (
    <LoadingContainer loading={addGithubHandleIsLoading || addDiscordHandleIsLoading}>
      <Column spacing="xl">
        <Box shadow={false}>
          <Column spacing="m">
            <Title variant="h2">TEAM</Title>
            <Text>Add your team's Github and Discord handles.</Text>
          </Column>
        </Box>
        <Box shadow={false}>
          <Column spacing="m">
            <Title variant="h2">
              <FaGithub />
              &nbsp;GITHUB HANDLES
            </Title>
            <Column spacing="s">
              {githubMembers?.map((member) => (
                <Row
                  alignment={["space-between"]}
                  className={styles.itemRow}
                  onClick={() => handleGithubHandleClick(member.handle)}
                  key={`github-member-${member.handle}`}
                >
                  <Text>{member.handle}</Text>
                  {member.pendingInvite && (
                    <Text size="small" variant="secondary">
                      Github invite pending ...
                    </Text>
                  )}
                </Row>
              ))}
            </Column>
            <Column spacing="xs">
              <Text size="small" strong>
                Add new Github handle
              </Text>
              <Row spacing="m">
                <Input value={githubHandle} onChange={setGithubHandle} />
                <Button
                  disabled={!githubHanldleIsValid && !isValidatingGithubHandle}
                  onClick={handleAddGithubHandleClick}
                >
                  Add
                </Button>
              </Row>
              {isValidatingGithubHandle && <Text size="small">Validating Github handle...</Text>}
              {githubHanldleIsValid === false && (
                <Text variant="warning" size="small">
                  Invalid Github handle
                </Text>
              )}
              {githubHanldleIsValid && (
                <Row
                  spacing="xs"
                  className={cx([styles.itemRow, styles.preview])}
                  onClick={() => handleGithubHandleClick(debouncedGithubHandle)}
                >
                  <Text size="small" variant="secondary">
                    Make sure this is the person you're trying to add to your team:
                  </Text>
                  <FaGithub />
                  <Text>{debouncedGithubHandle}</Text>
                </Row>
              )}
            </Column>
          </Column>
        </Box>
        <Box shadow={false}>
          <Column spacing="m">
            <Title variant="h2">
              <FaDiscord />
              &nbsp; DISCORD HANDLES
            </Title>
            {discordMembers?.map((member) => (
              <Row spacing="xs" className={styles.itemRow} key={`discord-handle-${member.handle}`}>
                <Text>{`@ ${member.handle}`}</Text>
                <Text variant="secondary">{`#${member.discriminator}`}</Text>
              </Row>
            ))}
            <Column spacing="xs">
              <Text size="small" strong>
                Add new Discord handle
              </Text>
              <Row spacing="m">
                <Input value={discordHandle} onChange={setDiscordHandle} />
                <Button disabled={discordHandle === ""} onClick={handleAddDiscordHandleClick}>
                  Add
                </Button>
              </Row>
              {isValidatingDiscordHandle && <Text size="small">Validating ...</Text>}
              {discordHandleValidationError && (
                <Text variant="warning" size="small">
                  Invalid Discord handle
                </Text>
              )}
              {discordValidation && (
                <Row
                  spacing="xs"
                  className={cx([styles.itemRow, styles.preview])}
                  onClick={() => handleDiscordHandleClick(discordValidation.userID)}
                >
                  <FaDiscord />
                  <Text>{`@${discordValidation.handle}`}</Text>
                  <Text variant="secondary">{`#${discordValidation.discriminator}`}</Text>
                </Row>
              )}
            </Column>
          </Column>
        </Box>
      </Column>
      {addGithubHandleError && <ErrorModal reason={addGithubHandleError.message} onClose={handleErrorModalClose} />}
      {addDiscordHandleError && <ErrorModal reason={addDiscordHandleError.message} onClose={handleErrorModalClose} />}
    </LoadingContainer>
  )
}
