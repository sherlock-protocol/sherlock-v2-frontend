import React, { useState } from "react"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { Column, Row } from "../../components/Layout"
import { Modal, Props as ModalProps } from "../../components/Modal/Modal"
import { Auditor, Contest, useContestSignUp } from "../../hooks/api/contests"
import { Field } from "../Claim/Field"
import { Text } from "../../components/Text"
import { SignUpSuccessModal } from "./SignUpSuccessModal"
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer"

type Props = ModalProps & {
  auditor?: Auditor | null
  contest: Contest
  signature: string
}

export const AuditorFormModal: React.FC<Props> = ({ auditor, contest, signature, onClose }) => {
  const [handle, setHandle] = useState(auditor?.handle ?? "")
  const [githubHandle, setGithubHandle] = useState(auditor?.githubHandle ?? "")
  const [discordHandle, setDiscordHandle] = useState(auditor?.discordHandle ?? "")

  const {
    mutate: doSignUp,
    isLoading,
    isSuccess: isSignUpSuccess,
    data: signUpData,
  } = useContestSignUp({
    handle,
    githubHandle,
    discordHandle,
    contestId: contest.id,
    signature,
  })

  return (
    <Modal closeable>
      <LoadingContainer loading={isLoading} label="Signing up...">
        <Column spacing="xl">
          <Row>
            <Column grow={1} spacing="s">
              <Row alignment="center">
                <img src={contest.logoURL} alt={contest.title} width={80} height={80} />
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
            <Field label="GITHUB (optional)">
              <Input value={githubHandle} onChange={setGithubHandle} disabled={!!auditor?.githubHandle} />
            </Field>
          </Row>
          <Row>
            <Field label="DISCORD (optional)">
              <Input value={discordHandle} onChange={setDiscordHandle} disabled={!!auditor?.discordHandle} />
            </Field>
          </Row>
          <Row>
            <Button fullWidth onClick={() => doSignUp()} disabled={isLoading}>
              {isLoading ? "SIGNING UP..." : "SIGN UP"}
            </Button>
          </Row>
        </Column>
      </LoadingContainer>
      {isSignUpSuccess && <SignUpSuccessModal contest={contest} onClose={onClose} repo={signUpData?.repo} />}
    </Modal>
  )
}
