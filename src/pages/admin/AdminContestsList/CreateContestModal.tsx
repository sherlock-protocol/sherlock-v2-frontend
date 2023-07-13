import { BigNumber, ethers } from "ethers"
import { DateTime } from "luxon"
import { useCallback, useEffect, useMemo, useState } from "react"
import { FaChrome, FaTwitter, FaGithub } from "react-icons/fa"
import { useDebounce } from "use-debounce"
import { Button } from "../../../components/Button"
import { Input } from "../../../components/Input"
import { Column, Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import Modal, { Props as ModalProps } from "../../../components/Modal/Modal"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import TokenInput from "../../../components/TokenInput/TokenInput"
import { useAdminCreateContest } from "../../../hooks/api/admin/useAdminCreateContest"
import { useAdminProtocol } from "../../../hooks/api/admin/useAdminProtocol"
import { commify } from "../../../utils/units"
import { Field } from "../../Claim/Field"
import { ErrorModal } from "../../../pages/ContestDetails/ErrorModal"
import { useAdminTwitterAccount } from "../../../hooks/api/admin/useTwitterAccount"
import { useAdminContestVariables } from "../../../hooks/api/admin/useAdminContestVariables"

type Props = ModalProps & {}

const DATE_FORMAT = "yyyy-MM-dd"

export const CreateContestModal: React.FC<Props> = ({ onClose }) => {
  const [protocolName, setProtocolName] = useState("")
  const [debouncedProtocolName] = useDebounce(protocolName, 300)
  const {
    data: protocol,
    isError: protocolNotFound,
    isLoading: protocolLoading,
  } = useAdminProtocol(debouncedProtocolName)
  const { createContest, isLoading, isSuccess, error, reset } = useAdminCreateContest()

  const [protocolTwitter, setProtocolTwitter] = useState(protocol?.twitter ?? "")
  const [protocolGithubTeam, setProtocolGithubTeam] = useState(protocol?.githubTeam ?? "")
  const [protocolWebsite, setProtocolWebsite] = useState(protocol?.website ?? "")
  const [protocolLogoURL, setProtocolLogoURL] = useState(protocol?.logoURL ?? "")

  const [debouncedProtocolTwitter] = useDebounce(protocolTwitter, 300)
  const { data: twitterAccount } = useAdminTwitterAccount(debouncedProtocolTwitter)

  const [contestTitle, setContestTitle] = useState("")
  const [contestShortDescription, setShortDescription] = useState("")
  const [contestNSLOC, setContestNSLOC] = useState("")
  const [debouncedContestNSLOC] = useDebounce(contestNSLOC, 300)
  const [contestStartDate, setContestStartDate] = useState("")
  const [contestAuditLength, setContestAuditLength] = useState("")
  const [contestAuditRewards, setContestAuditRewards] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [contestLeadSeniorWatsonFixedPay, setContestLeadSeniorWatsonFixedPay] = useState<BigNumber | undefined>(
    BigNumber.from(0)
  )
  const [contestJudgingPrizePool, setContestJudgingPrizePool] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [contestLeadJudgeFixedPay, setContestLeadJudgeFixedPay] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [contestTotalCost, setContestTotalCost] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [initialAuditContestRewards, setInitialAuditContestRewards] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [initialLeadSeniorWatsonFixedPay, setInitialLeadSeniorWatsonFixedPay] = useState<BigNumber | undefined>(
    BigNumber.from(0)
  )
  const [initialJudgingPrizePool, setInitialJudgingPrizePool] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [initialLeadJudgeFixedPay, setInitialLeadJudgeFixedPay] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [initialTotalCost, setInitialTotalCost] = useState<BigNumber | undefined>(BigNumber.from(0))

  const [startDateError, setStartDateError] = useState<string>()
  const [shortDescriptionError, setShortDescriptionError] = useState<string>()

  const [displayModalCloseConfirm, setDisplayModalFormConfirm] = useState(false)

  const displayProtocolInfo = !!protocol || protocolNotFound || protocolLoading

  const { data: contestVariables, isSuccess: contestVariablesSuccess } = useAdminContestVariables(
    parseInt(debouncedContestNSLOC)
  )

  useEffect(() => {
    if (contestVariablesSuccess) {
      setContestAuditLength(`${contestVariables.length}`)

      setInitialAuditContestRewards(ethers.utils.parseUnits(`${contestVariables.auditContestRewards}`, 6))
      setInitialJudgingPrizePool(ethers.utils.parseUnits(`${contestVariables.judgingPrizePool}`, 6))
      setInitialLeadJudgeFixedPay(ethers.utils.parseUnits(`${contestVariables.leadJudgeFixedPay}`, 6))
      setInitialTotalCost(ethers.utils.parseUnits(`${contestVariables.fullPayment}`, 6))
    } else {
      setContestAuditLength("")
      setInitialAuditContestRewards(BigNumber.from(0))
      setInitialJudgingPrizePool(BigNumber.from(0))
      setInitialLeadJudgeFixedPay(BigNumber.from(0))
      setInitialTotalCost(BigNumber.from(0))
    }
  }, [contestVariablesSuccess, setContestAuditLength, contestVariables])

  useEffect(() => {
    if (isSuccess) onClose?.()
  }, [isSuccess, onClose])

  useEffect(() => {
    if (protocol?.name) {
      setProtocolName(protocol?.name)
    }
  }, [protocol])

  useEffect(() => {
    if (twitterAccount?.profilePictureUrl) {
      setProtocolLogoURL(twitterAccount.profilePictureUrl)
    } else {
      setProtocolLogoURL("")
    }
  }, [twitterAccount])

  useEffect(() => {
    if (contestStartDate === "") {
      setStartDateError(undefined)
      return
    }

    const startDate = DateTime.fromFormat(contestStartDate, DATE_FORMAT)

    if (!startDate.isValid) {
      setStartDateError(`Invalid date. Must be format ${DATE_FORMAT}`)
      return
    }

    if (startDate < DateTime.now()) {
      setStartDateError("Start date cannot be in the past.")
      return
    }

    setStartDateError(undefined)
  }, [contestStartDate, contestAuditLength])

  // useEffect(() => {
  //   if (!contestAuditPrizePool) return

  //   const fixedPay = contestAuditPrizePool.div(10).mul(4)
  //   const judgingPool = contestAuditPrizePool.div(100).mul(5)

  //   setInitialLeadSeniorWatsonFixedPay(fixedPay)
  //   setInitialJudgingPrizePool(judgingPool)
  //   setInitialLeadJudgeFixedPay(judgingPool)
  // }, [contestAuditPrizePool, setInitialLeadSeniorWatsonFixedPay, setInitialJudgingPrizePool, setInitialTotalCost])

  // useEffect(() => {
  //   if (!contestJudgingPrizePool) return
  //   setInitialLeadJudgeFixedPay(contestJudgingPrizePool)
  // }, [contestJudgingPrizePool])

  // useEffect(() => {
  //   const total = contestAuditPrizePool
  //     ?.add(contestLeadSeniorWatsonFixedPay ?? 0)
  //     .add(contestJudgingPrizePool ?? 0)
  //     .add(contestLeadJudgeFixedPay ?? 0)
  //     .add(contestAuditPrizePool.div(100).mul(5))
  //   setInitialTotalCost(total)
  // }, [contestAuditPrizePool, contestLeadSeniorWatsonFixedPay, contestJudgingPrizePool, contestLeadJudgeFixedPay])

  const sherlockFee = useMemo(() => {
    const fee = contestTotalCost
      ?.sub(contestAuditRewards ?? 0)
      .sub(contestJudgingPrizePool ?? 0)
      .sub(contestLeadJudgeFixedPay ?? 0)

    return commify(parseInt(ethers.utils.formatUnits(fee ?? 0, 6)))
  }, [contestTotalCost, contestAuditRewards, contestJudgingPrizePool, contestLeadJudgeFixedPay])

  const canCreateContest = useMemo(() => {
    if (protocolName === "") return false
    if (protocolLogoURL === "" && !protocol?.logoURL) return false
    if (protocolWebsite === "" && !protocol?.website) return false
    if (protocolTwitter === "" && !protocol?.twitter) return false
    if (protocolGithubTeam === "" && !protocol?.githubTeam) return false

    if (contestTitle === "") return false
    if (contestShortDescription.length < 100 || contestShortDescription.length > 200) return false

    if (contestAuditLength === "") return false

    const startDate = DateTime.fromFormat(contestStartDate, DATE_FORMAT)

    if (!startDate.isValid) return false
    if (startDate < DateTime.now()) return false

    if (contestAuditRewards?.eq(BigNumber.from(0))) return false
    if (contestTotalCost?.eq(BigNumber.from(0))) return false

    return true
  }, [
    contestAuditLength,
    contestAuditRewards,
    contestShortDescription.length,
    contestStartDate,
    contestTitle,
    contestTotalCost,
    protocol?.logoURL,
    protocol?.twitter,
    protocol?.website,
    protocol?.githubTeam,
    protocolLogoURL,
    protocolName,
    protocolTwitter,
    protocolWebsite,
    protocolGithubTeam,
  ])

  const handleUpdateShortDescription = useCallback((value: string) => {
    setShortDescription(value)

    if (value === "") {
      setShortDescriptionError(undefined)
    } else if (value.length < 100) {
      setShortDescriptionError("Too short. Must be between 100 and 200 characters.")
    } else if (value.length > 200) {
      setShortDescriptionError("Too long. Must be between 100 and 200 characters.")
    } else {
      setShortDescriptionError(undefined)
    }
  }, [])

  const handleCreateContest = useCallback(() => {
    const startDate = DateTime.fromFormat(contestStartDate, DATE_FORMAT, { zone: "utc" }).set({
      hour: 15,
      minute: 0,
      second: 0,
      millisecond: 0,
    })
    const endDate = startDate
      .plus({ hours: 24 * parseInt(contestAuditLength) })
      .set({ hour: 15, minute: 0, second: 0, millisecond: 0 })

    createContest({
      protocol: {
        id: protocol?.id,
        name: protocolName,
        githubTeam: protocolGithubTeam || undefined,
        website: protocolWebsite || undefined,
        twitter: protocolTwitter || undefined,
        logoUrl: protocolLogoURL || undefined,
      },
      contest: {
        title: contestTitle,
        shortDescription: contestShortDescription,
        nSLOC: contestNSLOC,
        startDate,
        endDate,
        auditRewards: parseInt(ethers.utils.formatUnits(contestAuditRewards ?? 0, 6)),
        judgingPrizePool: parseInt(ethers.utils.formatUnits(contestJudgingPrizePool ?? 0, 6)),
        leadJudgeFixedPay: parseInt(ethers.utils.formatUnits(contestLeadJudgeFixedPay ?? 0, 6)),
        fullPayment: parseInt(ethers.utils.formatUnits(contestTotalCost ?? 0, 6)),
      },
    })
  }, [
    contestAuditLength,
    contestAuditRewards,
    contestJudgingPrizePool,
    contestLeadJudgeFixedPay,
    contestNSLOC,
    contestShortDescription,
    contestStartDate,
    contestTitle,
    contestTotalCost,
    createContest,
    protocol?.id,
    protocolLogoURL,
    protocolName,
    protocolTwitter,
    protocolWebsite,
    protocolGithubTeam,
  ])

  const formIsDirty = useMemo(
    () =>
      protocolName !== "" ||
      contestTitle !== "" ||
      contestShortDescription !== "" ||
      contestNSLOC !== "" ||
      contestStartDate !== "" ||
      contestAuditLength !== "" ||
      contestAuditRewards?.gt(BigNumber.from(0)) ||
      contestLeadSeniorWatsonFixedPay?.gt(BigNumber.from(0)) ||
      contestJudgingPrizePool?.gt(BigNumber.from(0)) ||
      contestLeadJudgeFixedPay?.gt(BigNumber.from(0)) ||
      contestTotalCost?.gt(BigNumber.from(0)),
    [
      contestAuditLength,
      contestAuditRewards,
      contestJudgingPrizePool,
      contestLeadSeniorWatsonFixedPay,
      contestLeadJudgeFixedPay,
      contestNSLOC,
      contestShortDescription,
      contestStartDate,
      contestTitle,
      contestTotalCost,
      protocolName,
    ]
  )

  const handleModalClose = useCallback(() => {
    if (formIsDirty) {
      setDisplayModalFormConfirm(true)
    } else {
      onClose && onClose()
    }
  }, [setDisplayModalFormConfirm, onClose, formIsDirty])

  const handleModalCloseConfirm = useCallback(() => {
    onClose && onClose()
  }, [onClose])

  const handleModalCloseCancel = useCallback(() => {
    setDisplayModalFormConfirm(false)
  }, [])

  return (
    <Modal closeable onClose={handleModalClose}>
      {displayModalCloseConfirm && (
        <Modal>
          <Column spacing="xl">
            <Title>Unsaved contest</Title>
            <Text>
              Are you sure you want to close this form? All unsaved changes will be lost and you will need to start
              over.
            </Text>
            <Row spacing="m" alignment="end">
              <Button variant="secondary" onClick={handleModalCloseCancel}>
                No, continue.
              </Button>
              <Button onClick={handleModalCloseConfirm}>Yes, close.</Button>
            </Row>
          </Column>
        </Modal>
      )}
      <LoadingContainer loading={isLoading} label={`Creating ${contestTitle} contest`}>
        <Column spacing="xl">
          <Title>New contest</Title>
          <Column spacing="m">
            <Title variant="h3">PROTOCOL</Title>
            <Field label="Name" detail={protocolNotFound ? "Protocol not found. A new protocol will be created." : ""}>
              <Input value={protocolName} onChange={setProtocolName} placeholder="Foo Protocol" />
            </Field>
            {displayProtocolInfo && (
              <>
                <Field
                  label={
                    <Row spacing="xs">
                      <FaGithub />
                      <Text>GitHub</Text>
                    </Row>
                  }
                >
                  <Input
                    value={protocol?.githubTeam ?? protocolGithubTeam}
                    disabled={!!protocol}
                    onChange={setProtocolGithubTeam}
                    placeholder="foo-protocol"
                  />
                </Field>
                <Field
                  label={
                    <Row spacing="xs">
                      <FaTwitter />
                      <Text>Twitter</Text>
                    </Row>
                  }
                >
                  <Input
                    value={protocol?.twitter ?? protocolTwitter}
                    disabled={!!protocol}
                    onChange={setProtocolTwitter}
                  />
                </Field>
                <Field
                  label={
                    <Row spacing="xs">
                      <FaChrome />
                      <Text>Website</Text>
                    </Row>
                  }
                >
                  <Input
                    value={protocol?.website ?? protocolWebsite}
                    disabled={!!protocol}
                    onChange={setProtocolWebsite}
                  />
                </Field>
                <Field label="Logo URL">
                  <Row alignment={["baseline", "center"]} grow={1} spacing="s">
                    <Input
                      value={protocol?.logoURL ?? protocolLogoURL}
                      disabled={!!protocol}
                      onChange={setProtocolLogoURL}
                    />
                    {(protocol?.logoURL || protocolLogoURL) && (
                      <img
                        src={protocol?.logoURL ?? protocolLogoURL}
                        alt="logo preview"
                        width={30}
                        height={30}
                        style={{ borderRadius: "50%" }}
                      />
                    )}
                  </Row>
                </Field>
              </>
            )}
          </Column>
          <hr />
          <Column spacing="m">
            <Title variant="h3">CONTEST</Title>
            <Field label="Title">
              <Input value={contestTitle} onChange={setContestTitle} />
            </Field>
            <Field label="Short Description" error={!!shortDescriptionError} errorMessage={shortDescriptionError ?? ""}>
              <Input value={contestShortDescription} onChange={handleUpdateShortDescription} />
            </Field>
            <Field label="Start Date" error={!!startDateError} errorMessage={startDateError ?? ""}>
              <Input value={contestStartDate} onChange={setContestStartDate} />
            </Field>
            <Field
              label="nSLOC"
              detail={
                isNaN(Number(contestNSLOC))
                  ? "Value is not a number. It won't be used to check the submitted nSLOC"
                  : ""
              }
            >
              <Input value={contestNSLOC} onChange={setContestNSLOC} />
            </Field>
            <Field label="Audit Length">
              <Input type="number" value={contestAuditLength} onChange={setContestAuditLength} />
            </Field>
            <Field label="Audit Contest Rewards" sublabel="Contest Pool + Lead fixed pay">
              <TokenInput token="USDC" initialValue={initialAuditContestRewards} onChange={setContestAuditRewards} />
            </Field>
            {/* <Field label="Lead Senior Watson Fixed Pay">
              <TokenInput
                token="USDC"
                initialValue={initialLeadSeniorWatsonFixedPay}
                onChange={setContestLeadSeniorWatsonFixedPay}
              />
            </Field> */}
            <Field label="Judging Contest Prize Pool">
              <TokenInput token="USDC" initialValue={initialJudgingPrizePool} onChange={setContestJudgingPrizePool} />
            </Field>
            <Field label="Lead Judge Fixed Pay">
              <TokenInput token="USDC" initialValue={initialLeadJudgeFixedPay} onChange={setContestLeadJudgeFixedPay} />
            </Field>
            <Field label="Total Cost">
              <TokenInput token="USDC" initialValue={initialTotalCost} onChange={setContestTotalCost} />
            </Field>
            <Text size="small">{`Admin Fee: ${sherlockFee} USDC`}</Text>
          </Column>
          <hr />
          <Button disabled={!canCreateContest} onClick={handleCreateContest}>
            Create contest
          </Button>
        </Column>
      </LoadingContainer>
      {error && <ErrorModal reason={error.message} onClose={() => reset()} />}
    </Modal>
  )
}
