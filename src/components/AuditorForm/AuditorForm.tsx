import React, { useEffect, useMemo, useState } from "react"
import { useDebounce } from "use-debounce"
import axios, { AxiosError } from "axios"
import { FaDiscord, FaGithub } from "react-icons/fa"

import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { Column, Row } from "../../components/Layout"
import { Field } from "../../pages/Claim/Field"

import { hasSpaces, onlyAscii } from "../../utils/strings"
import { useValidateDiscordHandle } from "../../hooks/api/auditors/useValidateDiscordHandle"
import { Text } from "../Text"

export type AuditorFormValues = {
  handle: string
  githubHandle: string
  discordHandle?: string
  twitterHandle?: string
  telegramHandle?: string
}

type Props = {
  initialValues?: Partial<AuditorFormValues>
  submitLabel?: string
  onSubmit: (values: AuditorFormValues) => void
  isLoading?: boolean
  disabledFields?: (keyof AuditorFormValues)[]
  disabled?: boolean
}
const HANDLE_LENGTH_MIN = 1
const HANDLE_LENGTH_MAX = 25

export const AuditorForm: React.FC<Props> = ({
  initialValues,
  onSubmit,
  disabledFields = [],
  submitLabel = "SUBMIT",
  disabled = false,
}) => {
  const [handle, setHandle] = useState(initialValues?.handle ?? "")
  const [debouncedHandle] = useDebounce(handle, 300)
  const [verifiedHandle, setVerifiedHandle] = useState<string>()
  const [handleVerificationError, setHandleVerificationError] = useState<string>()

  const [githubHandle, setGithubHandle] = useState(initialValues?.githubHandle ?? "")
  const [debouncedGithubHandle] = useDebounce(githubHandle, 300)
  const [verifiedGithubHandle, setVerifiedGithubHandle] = useState<string>()
  const [isVerifyingGithubHandle, setIsVerifyingGithubHandle] = useState(false)
  const [githubVerificationError, setGithubVerificationError] = useState(false)

  const [discordHandle, setDiscordHandle] = useState(initialValues?.discordHandle ?? "")
  const [debouncedDiscordHandle] = useDebounce(discordHandle, 300)

  const [twitterHandle, setTwitterHandle] = useState(initialValues?.twitterHandle ?? "")
  const [telegramHandle, setTelegramHandle] = useState(initialValues?.telegramHandle ?? "")

  const {
    data: discordValidation,
    isError: discordHandleValidationError,
    isLoading: isValidatingDiscordHandle,
  } = useValidateDiscordHandle(debouncedDiscordHandle)

  /**
   * Verify Handle
   */
  useEffect(() => {
    if (!debouncedHandle) {
      setHandleVerificationError(undefined)
      setVerifiedHandle(undefined)
    }

    let error = ""

    if (
      debouncedHandle !== "" &&
      (debouncedHandle.length < HANDLE_LENGTH_MIN || debouncedHandle.length > HANDLE_LENGTH_MAX)
    ) {
      error = `Handle must be between ${HANDLE_LENGTH_MIN} and ${HANDLE_LENGTH_MAX} characters`
    } else if (hasSpaces(debouncedHandle)) {
      error = "Cannot contain white spaces"
    } else if (!onlyAscii(debouncedHandle)) {
      error = "Only ascii characters are allowed"
    }

    if (!error) setVerifiedHandle(debouncedHandle)
    setHandleVerificationError(error)
  }, [debouncedHandle])

  /**
   * Verify Github handle
   */
  useEffect(() => {
    const resolveGithubHandle = async () => {
      if (!debouncedGithubHandle || debouncedGithubHandle.length === 0) {
        setVerifiedGithubHandle(undefined)
        return
      }

      try {
        setIsVerifyingGithubHandle(true)
        const { data: githubData } = await axios.get<{ type: string }>(
          `https://api.github.com/users/${debouncedGithubHandle}`
        )

        if (githubData.type === "User") {
          setVerifiedGithubHandle(debouncedGithubHandle)
          setGithubVerificationError(false)
        } else {
          setVerifiedGithubHandle(undefined)
          setGithubVerificationError(true)
        }
      } catch (error) {
        const axiosError = error as AxiosError

        if (
          axiosError.response?.headers["x-ratelimit-remaining"] &&
          parseInt(axiosError.response.headers["x-ratelimit-remaining"]) === 0
        ) {
          setVerifiedGithubHandle(debouncedGithubHandle)
          setGithubVerificationError(false)
        } else {
          setVerifiedGithubHandle(undefined)
          setGithubVerificationError(true)
        }
      } finally {
        setIsVerifyingGithubHandle(false)
      }
    }

    resolveGithubHandle()
  }, [debouncedGithubHandle])

  const isDirty = useMemo(
    () =>
      handle !== (initialValues?.handle ?? "") ||
      githubHandle !== (initialValues?.githubHandle ?? "") ||
      discordHandle !== (initialValues?.discordHandle ?? "") ||
      twitterHandle !== (initialValues?.twitterHandle ?? "") ||
      telegramHandle !== (initialValues?.telegramHandle ?? ""),
    [handle, githubHandle, discordHandle, twitterHandle, telegramHandle, initialValues]
  )

  const readyToSubmit = useMemo(
    () =>
      isDirty &&
      !!verifiedHandle &&
      verifiedHandle === handle &&
      !!verifiedGithubHandle &&
      !isVerifyingGithubHandle &&
      verifiedGithubHandle === githubHandle &&
      (discordHandle === "" || discordValidation),
    [
      handle,
      verifiedGithubHandle,
      githubHandle,
      isVerifyingGithubHandle,
      discordHandle,
      verifiedHandle,
      discordValidation,
      isDirty,
    ]
  )
  return (
    <Column spacing="l">
      <Row>
        <Field label="HANDLE *" error={!!handleVerificationError} errorMessage={handleVerificationError ?? ""}>
          <Input value={handle} onChange={setHandle} disabled={disabledFields.includes("handle")} />
        </Field>
      </Row>
      <Row>
        <Field
          label="GITHUB *"
          error={githubVerificationError && !isVerifyingGithubHandle}
          errorMessage={"Github handle not found"}
          detail={
            <Row>
              <FaGithub color={githubVerificationError ? "red" : "white"} /> &nbsp;
              {isVerifyingGithubHandle
                ? "Verifying Github handle..."
                : verifiedGithubHandle === githubHandle && (
                    <a href={`https://github.com/${verifiedGithubHandle}`} target="__blank">
                      {verifiedGithubHandle}
                    </a>
                  )}
            </Row>
          }
        >
          <Input value={githubHandle} onChange={setGithubHandle} disabled={disabledFields.includes("githubHandle")} />
        </Field>
      </Row>
      <Row>
        <Field
          label="DISCORD"
          error={discordHandleValidationError}
          errorMessage={"Handle must join Sherlock's Discord server"}
          detail={
            <Row spacing="xs">
              {isValidatingDiscordHandle && <Text>Validtating...</Text>}
              {discordValidation && (
                <>
                  <FaDiscord />
                  <Text>{discordValidation.handle}</Text>
                  <Text variant="secondary">{`#${discordValidation.discriminator}`}</Text>
                </>
              )}
            </Row>
          }
        >
          <Input
            value={discordHandle}
            onChange={setDiscordHandle}
            disabled={disabledFields.includes("discordHandle")}
          />
        </Field>
      </Row>
      <Row>
        <Field label="TWITTER (optional)">
          <Input
            value={twitterHandle}
            onChange={setTwitterHandle}
            disabled={disabledFields.includes("twitterHandle")}
          />
        </Field>
      </Row>
      <Row>
        <Field label="TELEGRAM (optional)">
          <Input
            value={telegramHandle}
            onChange={setTelegramHandle}
            disabled={disabledFields.includes("telegramHandle")}
          />
        </Field>
      </Row>
      <Row>
        <Button
          fullWidth
          onClick={() =>
            onSubmit({
              handle,
              githubHandle,
              discordHandle: discordValidation?.handle,
              telegramHandle,
              twitterHandle,
            })
          }
          disabled={!readyToSubmit || disabled}
        >
          {submitLabel}
        </Button>
      </Row>
    </Column>
  )
}
