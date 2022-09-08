import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useDebounce } from "use-debounce"
import axios, { AxiosError } from "axios"
import { FaGithub, FaInfoCircle } from "react-icons/fa"

import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { Column, Row } from "../../components/Layout"
import { Modal, Props as ModalProps } from "../../components/Modal/Modal"
import { Contest, useContestSignUp } from "../../hooks/api/contests"
import { Auditor } from "../../hooks/api/auditors"
import { Field } from "../Claim/Field"
import { Text } from "../../components/Text"
import { SignUpSuccessModal } from "./SignUpSuccessModal"
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer"

import styles from "./ContestDetails.module.scss"
import { hasSpaces, onlyAscii } from "../../utils/strings"
import { ErrorModal } from "./ErrorModal"
import { Title } from "../../components/Title"

type Props = ModalProps & {
  auditor?: Auditor | null
  contest: Contest
  signature: string
}

const HANDLE_LENGTH_LIMIT = 32

export const AuditorFormModal: React.FC<Props> = ({ auditor, contest, signature, onClose }) => {
  const [handle, setHandle] = useState(auditor?.handle ?? "")
  const [debouncedHandle] = useDebounce(handle, 300)
  const [verifiedHandle, setVerifiedHandle] = useState<string>()
  const [handleVerificationError, setHandleVerificationError] = useState<string>()

  const [githubHandle, setGithubHandle] = useState(auditor?.githubHandle ?? "")
  const [debouncedGithubHandle] = useDebounce(githubHandle, 300)
  const [verifiedGithubHandle, setVerifiedGithubHandle] = useState<string>()
  const [isVerifyingGithubHandle, setIsVerifyingGithubHandle] = useState(false)
  const [githubVerificationError, setGithubVerificationError] = useState(false)

  const [discordHandle, setDiscordHandle] = useState(auditor?.discordHandle ?? "")
  const [twitterHandle, setTwitterHandle] = useState(auditor?.twitterHandle ?? "")
  const [telegramHandle, setTelegramHandle] = useState(auditor?.telegramHandle ?? "")

  const {
    signUp: doSignUp,
    isLoading,
    isSuccess: isSignUpSuccess,
    data: signUpData,
    error,
    isError,
    reset,
  } = useContestSignUp({
    handle: verifiedHandle ?? "",
    githubHandle: verifiedGithubHandle ?? "",
    discordHandle: discordHandle,
    twitterHandle: twitterHandle.length > 0 ? twitterHandle : undefined,
    telegramHandle: telegramHandle.length > 0 ? telegramHandle : undefined,
    contestId: contest.id,
    signature,
  })

  /**
   * Verify Handle
   */
  useEffect(() => {
    if (!debouncedHandle) {
      setHandleVerificationError(undefined)
      setVerifiedHandle(undefined)
    }

    let error = ""

    if (debouncedHandle.length > HANDLE_LENGTH_LIMIT) {
      error = `Handle must be less than ${HANDLE_LENGTH_LIMIT} characters`
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

  const readyToSubmit = useMemo(
    () =>
      !!verifiedHandle &&
      verifiedHandle === handle &&
      !!verifiedGithubHandle &&
      !isVerifyingGithubHandle &&
      verifiedGithubHandle === githubHandle &&
      !!discordHandle,
    [handle, verifiedGithubHandle, githubHandle, isVerifyingGithubHandle, discordHandle, verifiedHandle]
  )

  const handleErrorModalClose = useCallback(() => {
    reset()
  }, [reset])

  return (
    <Modal closeable onClose={onClose}>
      <LoadingContainer loading={isLoading} label="Signing up...">
        <Column spacing="xl" className={styles.formContainer}>
          <Row>
            <Column grow={1} spacing="s">
              <Row alignment="center">
                <img src={contest.logoURL} alt={contest.title} width={80} height={80} className={styles.logo} />
              </Row>
              <Row alignment="center">
                <Text>You're signing up for</Text>
              </Row>
              <Row alignment="center">
                <Text strong>{contest.title}</Text>
              </Row>
            </Column>
          </Row>
          <Row className={styles.c4Banner}>
            <Column spacing="s">
              <Row>
                <FaInfoCircle />
                &nbsp;
                <Title variant="h3">IMPORTANT</Title>
              </Row>
              <Text>To claim a C4 handle, you need to authenticate using the address associated with it.</Text>
            </Column>
          </Row>
          <Row>
            <Field label="HANDLE *" error={!!handleVerificationError} errorMessage={handleVerificationError ?? ""}>
              <Input value={handle} onChange={setHandle} disabled={!!auditor?.handle} />
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
              <Input value={githubHandle} onChange={setGithubHandle} disabled={!!auditor?.githubHandle} />
            </Field>
          </Row>
          <Row>
            <Field label="DISCORD *">
              <Input value={discordHandle} onChange={setDiscordHandle} disabled={!!auditor?.discordHandle} />
            </Field>
          </Row>
          <Row>
            <Field label="TWITTER (optional)">
              <Input value={twitterHandle} onChange={setTwitterHandle} disabled={!!auditor?.discordHandle} />
            </Field>
          </Row>
          <Row>
            <Field label="TELEGRAM (optional)">
              <Input value={telegramHandle} onChange={setTelegramHandle} disabled={!!auditor?.discordHandle} />
            </Field>
          </Row>
          <Row>
            <Button fullWidth onClick={() => doSignUp()} disabled={isLoading || !readyToSubmit}>
              {isLoading ? "SIGNING UP..." : "SIGN UP"}
            </Button>
          </Row>
        </Column>
      </LoadingContainer>
      {isSignUpSuccess && <SignUpSuccessModal contest={contest} onClose={onClose} repo={signUpData?.repo} />}
      {isError && <ErrorModal reason={error?.fieldErrors ?? error?.message} onClose={handleErrorModalClose} />}
    </Modal>
  )
}
