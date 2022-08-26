import React, { useEffect, useMemo, useState } from "react"
import { useDebounce } from "use-debounce"
import axios, { AxiosError } from "axios"
import { FaGithub } from "react-icons/fa"

import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { Column, Row } from "../../components/Layout"
import { Modal, Props as ModalProps } from "../../components/Modal/Modal"
import { Auditor, Contest, useContestSignUp } from "../../hooks/api/contests"
import { Field } from "../Claim/Field"
import { Text } from "../../components/Text"
import { SignUpSuccessModal } from "./SignUpSuccessModal"
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer"

import styles from "./ContestDetails.module.scss"

type Props = ModalProps & {
  auditor?: Auditor | null
  contest: Contest
  signature: string
}

export const AuditorFormModal: React.FC<Props> = ({ auditor, contest, signature, onClose }) => {
  const [handle, setHandle] = useState(auditor?.handle ?? "")
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
  } = useContestSignUp({
    handle,
    githubHandle,
    discordHandle: discordHandle.length > 0 ? discordHandle : undefined,
    twitterHandle: twitterHandle.length > 0 ? twitterHandle : undefined,
    telegramHandle: telegramHandle.length > 0 ? telegramHandle : undefined,
    contestId: contest.id,
    signature,
  })

  useEffect(() => {
    const resolveGithubHandle = async () => {
      if (!debouncedGithubHandle || debouncedGithubHandle.length === 0) {
        setVerifiedGithubHandle(undefined)
        return
      }

      try {
        setIsVerifyingGithubHandle(true)
        const { headers } = await axios.get(`https://api.github.com/users/${debouncedGithubHandle}`)

        console.log(headers)

        setVerifiedGithubHandle(debouncedGithubHandle)
        setGithubVerificationError(false)
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
    () => !!handle && !!verifiedGithubHandle && !isVerifyingGithubHandle && verifiedGithubHandle === githubHandle,
    [handle, verifiedGithubHandle, githubHandle, isVerifyingGithubHandle]
  )

  return (
    <Modal closeable>
      <LoadingContainer loading={isLoading} label="Signing up...">
        <Column spacing="xl">
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
          <Row>
            <Field label="HANDLE">
              <Input value={handle} onChange={setHandle} disabled={!!auditor?.handle} />
            </Field>
          </Row>
          <Row>
            <Field
              label="GITHUB"
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
            <Field label="DISCORD (optional)">
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
    </Modal>
  )
}
