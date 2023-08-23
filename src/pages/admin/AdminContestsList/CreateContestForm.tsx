import { useCallback, useEffect, useMemo, useState } from "react"
import { FaChrome, FaGithub, FaTwitter } from "react-icons/fa"
import { useDebounce } from "use-debounce"
import { BigNumber, ethers } from "ethers"
import { DateTime } from "luxon"

import { Input } from "../../../components/Input"
import { Column, Row } from "../../../components/Layout"
import { Title } from "../../../components/Title"
import { useAdminProtocol } from "../../../hooks/api/admin/useAdminProtocol"
import { Field } from "../../Claim/Field"
import { useAdminTwitterAccount } from "../../../hooks/api/admin/useTwitterAccount"
import { useAdminContestVariables } from "../../../hooks/api/admin/useAdminContestVariables"
import { commify } from "../../../utils/units"
import { Text } from "../../../components/Text"
import TokenInput from "../../../components/TokenInput/TokenInput"
import { Button } from "../../../components/Button"
import { ContestsListItem } from "../../../hooks/api/admin/useAdminContests"

export type ContestValues = {
  protocol: {
    id?: number
    name: string
    twitter: string
    githubTeam: string
    website: string
    logoUrl: string
  }
  contest: {
    title: string
    shortDescription: string
    nSLOC: string
    startDate: DateTime
    endDate: DateTime
    auditRewards: number
    judgingPrizePool: number
    leadJudgeFixedPay: number
    fullPayment: number
  }
}

type Props = {
  onSubmit: (values: ContestValues) => void
  onDirtyChange: (dirty: boolean) => void
  submitLabel: string
  contest?: ContestsListItem
}

const DATE_FORMAT = "yyyy-MM-dd"

export const CreateContestForm: React.FC<Props> = ({ onSubmit, onDirtyChange, submitLabel, contest }) => {
  const [protocolName, setProtocolName] = useState("")
  const [debouncedProtocolName] = useDebounce(protocolName, 300)

  const {
    data: protocol,
    isError: protocolNotFound,
    isLoading: protocolLoading,
  } = useAdminProtocol(debouncedProtocolName)

  const [protocolTwitter, setProtocolTwitter] = useState(protocol?.twitter ?? "")
  const [protocolGithubTeam, setProtocolGithubTeam] = useState(protocol?.githubTeam ?? "")
  const [protocolWebsite, setProtocolWebsite] = useState(protocol?.website ?? "")
  const [protocolLogoURL, setProtocolLogoURL] = useState(protocol?.logoURL ?? "")

  const [debouncedProtocolTwitter] = useDebounce(protocolTwitter, 300)
  const { data: twitterAccount } = useAdminTwitterAccount(debouncedProtocolTwitter)

  const [contestTitle, setContestTitle] = useState("")
  const [contestShortDescription, setShortDescription] = useState("")
  const [contestNSLOC, setContestNSLOC] = useState(contest?.linesOfCode ?? "")
  const [debouncedContestNSLOC] = useDebounce(contestNSLOC, 300)
  const [contestStartDate, setContestStartDate] = useState("")
  const [contestAuditLength, setContestAuditLength] = useState("")
  const [contestAuditRewards, setContestAuditRewards] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [contestJudgingPrizePool, setContestJudgingPrizePool] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [contestLeadJudgeFixedPay, setContestLeadJudgeFixedPay] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [contestTotalCost, setContestTotalCost] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [initialAuditContestRewards, setInitialAuditContestRewards] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [initialJudgingPrizePool, setInitialJudgingPrizePool] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [initialLeadJudgeFixedPay, setInitialLeadJudgeFixedPay] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [initialTotalCost, setInitialTotalCost] = useState<BigNumber | undefined>(BigNumber.from(0))

  const [startDateError, setStartDateError] = useState<string>()
  const [shortDescriptionError, setShortDescriptionError] = useState<string>()

  const displayProtocolInfo = !!protocol || protocolNotFound || protocolLoading

  const { data: contestVariables, isSuccess: contestVariablesSuccess } = useAdminContestVariables(
    parseInt(debouncedContestNSLOC)
  )

  useEffect(() => {
    if (contest) {
      const startDate = DateTime.fromSeconds(contest.startDate)
      const endDate = DateTime.fromSeconds(contest.endDate)
      const auditLength = endDate.diff(startDate, "days").days

      setContestTitle(contest.title)
      setShortDescription(contest.shortDescription)
      setContestStartDate(startDate.toFormat(DATE_FORMAT))
      setContestAuditLength(auditLength.toString())
      setInitialAuditContestRewards(ethers.utils.parseUnits(`${contest.rewards}`, 6))
      setInitialJudgingPrizePool(ethers.utils.parseUnits(`${contest.judgingPrizePool}`, 6))
      setInitialLeadJudgeFixedPay(ethers.utils.parseUnits(`${contest.leadJudgeFixedPay}`, 6))
      setInitialTotalCost(ethers.utils.parseUnits(`${contest.fullPayment}`, 6))
    }
  }, [contest])

  useEffect(() => {
    if (contestVariablesSuccess && !contest) {
      setContestAuditLength(`${contestVariables.length}`)
      setInitialAuditContestRewards(ethers.utils.parseUnits(`${contestVariables.auditContestRewards}`, 6))
      setInitialJudgingPrizePool(ethers.utils.parseUnits(`${contestVariables.judgingPrizePool}`, 6))
      setInitialLeadJudgeFixedPay(ethers.utils.parseUnits(`${contestVariables.leadJudgeFixedPay}`, 6))
      setInitialTotalCost(ethers.utils.parseUnits(`${contestVariables.fullPayment}`, 6))
    }
  }, [contestVariablesSuccess, setContestAuditLength, contestVariables, contest])

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

  const sherlockFee = useMemo(() => {
    const fee = contestTotalCost
      ?.sub(contestAuditRewards ?? 0)
      .sub(contestJudgingPrizePool ?? 0)
      .sub(contestLeadJudgeFixedPay ?? 0)

    return commify(parseInt(ethers.utils.formatUnits(fee ?? 0, 6)))
  }, [contestTotalCost, contestAuditRewards, contestJudgingPrizePool, contestLeadJudgeFixedPay])

  const canSubmit = useMemo(() => {
    if (!contest) {
      if (protocolName === "") return false
      if (protocolLogoURL === "" && !protocol?.logoURL) return false
      if (protocolWebsite === "" && !protocol?.website) return false
      if (protocolGithubTeam === "" && !protocol?.githubTeam) return false
    }

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
    protocol?.website,
    protocol?.githubTeam,
    protocolLogoURL,
    protocolName,
    protocolWebsite,
    protocolGithubTeam,
    contest,
  ])

  useEffect(() => {
    if (contest) {
      const startDate = DateTime.fromSeconds(contest.startDate)
      const endDate = DateTime.fromSeconds(contest.endDate)
      const auditLength = endDate.diff(startDate, "days").days

      onDirtyChange(
        (contestTitle !== contest.title ||
          contestShortDescription !== contest.shortDescription ||
          contestNSLOC !== contest.linesOfCode ||
          contestStartDate !== startDate.toFormat(DATE_FORMAT) ||
          contestAuditLength !== auditLength.toString() ||
          !contestAuditRewards?.eq(ethers.utils.parseUnits(`${contest.rewards}`, 6)) ||
          !contestJudgingPrizePool?.eq(ethers.utils.parseUnits(`${contest.judgingPrizePool}`, 6)) ||
          !contestLeadJudgeFixedPay?.eq(ethers.utils.parseUnits(`${contest.leadJudgeFixedPay}`, 6)) ||
          !contestTotalCost?.eq(ethers.utils.parseUnits(`${contest.fullPayment}`, 6))) ??
          false
      )
    } else {
      onDirtyChange(
        (protocolName !== "" ||
          contestTitle !== "" ||
          contestShortDescription !== "" ||
          contestNSLOC !== "" ||
          contestStartDate !== "" ||
          contestAuditLength !== "" ||
          contestAuditRewards?.gt(BigNumber.from(0)) ||
          contestJudgingPrizePool?.gt(BigNumber.from(0)) ||
          contestLeadJudgeFixedPay?.gt(BigNumber.from(0)) ||
          contestTotalCost?.gt(BigNumber.from(0))) ??
          false
      )
    }
  }, [
    contest,
    contestAuditLength,
    contestAuditRewards,
    contestJudgingPrizePool,
    contestLeadJudgeFixedPay,
    contestNSLOC,
    contestShortDescription,
    contestStartDate,
    contestTitle,
    contestTotalCost,
    onDirtyChange,
    protocolName,
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

  const handleSubmit = useCallback(() => {
    const startDate = DateTime.fromFormat(contestStartDate, DATE_FORMAT, { zone: "utc" }).set({
      hour: 15,
      minute: 0,
      second: 0,
      millisecond: 0,
    })
    const endDate = startDate
      .plus({ hours: 24 * parseInt(contestAuditLength) })
      .set({ hour: 15, minute: 0, second: 0, millisecond: 0 })
    onSubmit({
      protocol: {
        id: protocol?.id,
        name: protocolName,
        githubTeam: protocolGithubTeam,
        twitter: protocolTwitter,
        website: protocolWebsite,
        logoUrl: protocolLogoURL,
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
    onSubmit,
    protocol?.id,
    protocolGithubTeam,
    protocolLogoURL,
    protocolName,
    protocolTwitter,
    protocolWebsite,
  ])

  return (
    <Column spacing="xl">
      {!contest ? (
        <>
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
        </>
      ) : null}
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
            isNaN(Number(contestNSLOC)) ? "Value is not a number. It won't be used to check the submitted nSLOC" : ""
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
      <Button disabled={!canSubmit} onClick={handleSubmit}>
        {submitLabel}
      </Button>
    </Column>
  )
}
