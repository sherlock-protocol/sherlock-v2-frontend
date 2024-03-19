import { useCallback, useEffect, useMemo, useState } from "react"
import { FaChrome, FaTwitter } from "react-icons/fa"
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
import RadioButton from "../../../components/RadioButton/RadioButton"
import styles from "./CreateContestForm.module.scss"

export type ContestValues = {
  protocol: {
    id?: number
    name?: string
    twitter?: string
    website?: string
    logoUrl?: string
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
    lswPaymentStructure?: "TIERED" | "BEST_EFFORTS" | "FIXED"
    customLswFixedPay?: number | null
    private?: boolean
    requiresKYC?: boolean
    maxNumberOfParticipants?: number | null
  }
}

type Props = {
  onSubmit: (values: ContestValues) => void
  onDirtyChange: (dirty: boolean) => void
  submitLabel: string
  contest?: ContestsListItem
  draft?: boolean
}

const DATE_FORMAT = "yyyy-MM-dd"

export const CreateContestForm: React.FC<Props> = ({
  onSubmit,
  onDirtyChange,
  submitLabel,
  contest,
  draft = false,
}) => {
  const [protocolName, setProtocolName] = useState("")
  const [debouncedProtocolName] = useDebounce(protocolName, 300)

  const {
    data: protocol,
    isError: protocolNotFound,
    isLoading: protocolLoading,
  } = useAdminProtocol(debouncedProtocolName)

  const [protocolTwitter, setProtocolTwitter] = useState(protocol?.twitter ?? "")
  const [protocolWebsite, setProtocolWebsite] = useState(protocol?.website ?? "")
  const [protocolLogoURL, setProtocolLogoURL] = useState(protocol?.logoURL ?? "")

  const [debouncedProtocolTwitter] = useDebounce(protocolTwitter, 300)
  const { data: twitterAccount } = useAdminTwitterAccount(debouncedProtocolTwitter)

  const [contestTitle, setContestTitle] = useState("")
  const [contestShortDescription, setShortDescription] = useState("")
  const [contestNSLOC, setContestNSLOC] = useState(contest?.nSLOC?.toString() ?? "")
  const [debouncedContestNSLOC] = useDebounce(contestNSLOC, 300)
  const [contestStartDate, setContestStartDate] = useState("")
  const [contestAuditLength, setContestAuditLength] = useState("")
  const [contestTotalRewards, setContestTotalRewards] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [contestAuditRewards, setContestAuditRewards] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [contestJudgingPrizePool, setContestJudgingPrizePool] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [contestLeadJudgeFixedPay, setContestLeadJudgeFixedPay] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [contestTotalCost, setContestTotalCost] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [isPrivate, setIsPrivate] = useState(false)
  const [requiresKYC, setRequiresKYC] = useState(false)
  const [lswPaymentStructure, setLswPaymentStructure] = useState<"TIERED" | "BEST_EFFORTS" | "FIXED">("TIERED")
  const [customLswFixedPay, setCustomLswFixedPay] = useState<BigNumber | undefined>(undefined)
  const [hasLimitedContestants, setHasLimitedContestants] = useState(false)
  const [maxNumberOfParticipants, setmaxNumberOfParticipants] = useState<string>("")

  const [initialTotalRewards, setInitialTotalRewards] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [initialAuditContestRewards, setInitialAuditContestRewards] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [initialJudgingPrizePool, setInitialJudgingPrizePool] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [initialLeadJudgeFixedPay, setInitialLeadJudgeFixedPay] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [initialTotalCost, setInitialTotalCost] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [initialCustomLswFixedPay, setInitialCustomLswFixedPay] = useState<BigNumber | undefined>(BigNumber.from(0))

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
      setInitialTotalRewards(
        ethers.utils.parseUnits(`${contest.rewards + contest.judgingPrizePool + contest.leadJudgeFixedPay}`, 6)
      )
      setInitialAuditContestRewards(ethers.utils.parseUnits(`${contest.rewards}`, 6))
      setInitialJudgingPrizePool(ethers.utils.parseUnits(`${contest.judgingPrizePool}`, 6))
      setInitialLeadJudgeFixedPay(ethers.utils.parseUnits(`${contest.leadJudgeFixedPay}`, 6))
      setInitialTotalCost(ethers.utils.parseUnits(`${contest.fullPayment}`, 6))
      setIsPrivate(contest.private)
      setRequiresKYC(contest.requiresKYC)
      setLswPaymentStructure(contest.lswPaymentStructure)
      setHasLimitedContestants(!!contest.maxNumberOfParticipants)
      setmaxNumberOfParticipants(contest.maxNumberOfParticipants?.toString() ?? "")
      setCustomLswFixedPay(ethers.utils.parseUnits(`${contest.leadSeniorAuditorFixedPay ?? 0}`, 6))
      setInitialCustomLswFixedPay(ethers.utils.parseUnits(`${contest.leadSeniorAuditorFixedPay ?? 0}`, 6))
    }
  }, [contest])

  useEffect(() => {
    if (contestVariablesSuccess && (!contest || contest.status === "DRAFT")) {
      setContestAuditLength(`${contestVariables.length}`)
      setInitialTotalRewards(ethers.utils.parseUnits(`${contestVariables.minTotalRewards}`, 6))
      setInitialAuditContestRewards(ethers.utils.parseUnits(`${contestVariables.minContestRewards}`, 6))
      setInitialJudgingPrizePool(ethers.utils.parseUnits(`${contestVariables.judgingPrizePool}`, 6))
      setInitialLeadJudgeFixedPay(ethers.utils.parseUnits(`${contestVariables.leadJudgeFixedPay}`, 6))
      setInitialTotalCost(ethers.utils.parseUnits(`${contestVariables.minTotalPrice}`, 6))
    }
  }, [contestVariablesSuccess, setContestAuditLength, contestVariables, contest])

  useEffect(() => {
    const diff = contestTotalRewards
      ?.sub(contestAuditRewards ?? BigNumber.from(0))
      .sub(contestJudgingPrizePool ?? BigNumber.from(0))
      .sub(contestLeadJudgeFixedPay ?? BigNumber.from(0))

    setInitialAuditContestRewards(contestAuditRewards?.add(diff ?? BigNumber.from(0)))
  }, [contestTotalRewards, setInitialAuditContestRewards])

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
    }

    if (contestTitle === "") return false

    if (draft) return true

    if (contestShortDescription === "") return false
    if (contestAuditLength === "") return false

    const startDate = DateTime.fromFormat(contestStartDate, DATE_FORMAT)

    if (!startDate.isValid) return false
    if (startDate < DateTime.now()) return false
    if (contestAuditRewards?.eq(BigNumber.from(0))) return false
    if (contestTotalCost?.eq(BigNumber.from(0))) return false
    if (lswPaymentStructure === "FIXED" && !customLswFixedPay?.gt(BigNumber.from(0))) return false
    if (hasLimitedContestants && (maxNumberOfParticipants === "" || maxNumberOfParticipants === "0")) return false

    return true
  }, [
    draft,
    contestShortDescription,
    contestAuditLength,
    contestAuditRewards,
    contestStartDate,
    contestTitle,
    contestTotalCost,
    protocol?.logoURL,
    protocol?.website,
    protocolLogoURL,
    protocolName,
    protocolWebsite,
    contest,
    lswPaymentStructure,
    customLswFixedPay,
    hasLimitedContestants,
    maxNumberOfParticipants,
  ])

  useEffect(() => {
    if (contest) {
      const startDate = DateTime.fromSeconds(contest.startDate)
      const endDate = DateTime.fromSeconds(contest.endDate)
      const auditLength = endDate.diff(startDate, "days").days

      onDirtyChange(
        (contestTitle !== contest.title ||
          contestShortDescription !== contest.shortDescription ||
          contestNSLOC !== contest.nSLOC?.toString() ||
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
        name: protocolName === "" ? undefined : protocolName,
        twitter: protocolTwitter === "" ? undefined : protocolTwitter,
        website: protocolWebsite === "" ? undefined : protocolWebsite,
        logoUrl: protocolLogoURL === "" ? undefined : protocolLogoURL,
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
        lswPaymentStructure,
        private: isPrivate,
        requiresKYC,
        customLswFixedPay: customLswFixedPay ? parseInt(ethers.utils.formatUnits(customLswFixedPay ?? 0, 6)) : null,
        maxNumberOfParticipants:
          hasLimitedContestants && maxNumberOfParticipants && maxNumberOfParticipants !== ""
            ? parseInt(maxNumberOfParticipants)
            : null,
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
    protocolLogoURL,
    protocolName,
    protocolTwitter,
    protocolWebsite,
    lswPaymentStructure,
    isPrivate,
    requiresKYC,
    customLswFixedPay,
    maxNumberOfParticipants,
    hasLimitedContestants,
  ])

  const isMinimum = useMemo(
    () =>
      contestVariables &&
      contestTotalRewards?.eq(ethers.utils.parseUnits(`${contestVariables?.minTotalRewards}`, 6)) &&
      contestAuditRewards?.eq(ethers.utils.parseUnits(`${contestVariables?.minContestRewards}`, 6)) &&
      contestTotalCost?.eq(ethers.utils.parseUnits(`${contestVariables?.minTotalPrice}`, 6)),
    [contestTotalRewards, contestAuditRewards, contestTotalCost, contestVariables]
  )

  const isRecommended = useMemo(
    () =>
      contestVariables &&
      contestTotalRewards?.eq(ethers.utils.parseUnits(`${contestVariables?.recTotalRewards}`, 6)) &&
      contestAuditRewards?.eq(ethers.utils.parseUnits(`${contestVariables?.recContestRewards}`, 6)) &&
      contestTotalCost?.eq(ethers.utils.parseUnits(`${contestVariables?.recTotalPrice}`, 6)),
    [contestTotalRewards, contestAuditRewards, contestTotalCost, contestVariables]
  )

  const handleAutoFillValues = useCallback(
    (type: "minimum" | "recommended") => {
      if (type === "minimum") {
        setInitialTotalRewards(ethers.utils.parseUnits(`${contestVariables?.minTotalRewards}`, 6))
        setInitialAuditContestRewards(ethers.utils.parseUnits(`${contestVariables?.minContestRewards}`, 6))
        setInitialTotalCost(ethers.utils.parseUnits(`${contestVariables?.minTotalPrice}`, 6))
      } else {
        setInitialTotalRewards(ethers.utils.parseUnits(`${contestVariables?.recTotalRewards}`, 6))
        setInitialAuditContestRewards(ethers.utils.parseUnits(`${contestVariables?.recContestRewards}`, 6))
        setInitialTotalCost(ethers.utils.parseUnits(`${contestVariables?.recTotalPrice}`, 6))
      }
    },
    [setInitialTotalCost, setInitialAuditContestRewards, setInitialTotalRewards, contestVariables]
  )

  const lswPaymentStructureDetails = useMemo(() => {
    switch (lswPaymentStructure) {
      case "TIERED":
        return "The Lead Senior Watson fixed pay is determied by his leaderboard ranking."
      case "BEST_EFFORTS":
        return "The Lead Senior Watson is 33% of the Audit Contest Rewards."
      case "FIXED":
        return "The Lead Senior Watson is a custom fixed amount."
    }
  }, [lswPaymentStructure])

  const handleSetContestSetup = useCallback((contestSetup: "public" | "private" | "1v1" | "custom") => {
    if (contestSetup === "public") {
      setIsPrivate(false)
      setRequiresKYC(false)
      setLswPaymentStructure("TIERED")
      setHasLimitedContestants(false)
    } else if (contestSetup === "private") {
      setIsPrivate(true)
      setRequiresKYC(true)
      setLswPaymentStructure("TIERED")
      setHasLimitedContestants(true)
      setmaxNumberOfParticipants("10")
    } else if (contestSetup === "1v1") {
      setIsPrivate(true)
      setRequiresKYC(true)
      setLswPaymentStructure("FIXED")
      setHasLimitedContestants(true)
      setmaxNumberOfParticipants("2")
    }
  }, [])

  const contestSetup = useMemo(() => {
    if (!isPrivate && !requiresKYC && lswPaymentStructure === "TIERED" && !hasLimitedContestants) {
      return "public"
    } else if (
      isPrivate &&
      requiresKYC &&
      lswPaymentStructure === "TIERED" &&
      hasLimitedContestants &&
      maxNumberOfParticipants === "10"
    ) {
      return "private"
    } else if (
      isPrivate &&
      requiresKYC &&
      lswPaymentStructure === "FIXED" &&
      hasLimitedContestants &&
      maxNumberOfParticipants === "2"
    ) {
      return "1v1"
    } else {
      return "custom"
    }
  }, [isPrivate, requiresKYC, lswPaymentStructure, hasLimitedContestants, maxNumberOfParticipants])

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
        {draft ? null : (
          <Column spacing="s">
            <Field label="Short Description" error={!!shortDescriptionError} errorMessage={shortDescriptionError ?? ""}>
              <Input value={contestShortDescription} onChange={setShortDescription} />
            </Field>
            <Row spacing="s">
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
                <Input
                  type="number"
                  value={contestAuditLength}
                  onChange={setContestAuditLength}
                  placeholder="days"
                  persistPlaceholder
                />
              </Field>
            </Row>

            <Row spacing="xl">
              <Column spacing="s" alignment={["stretch", "start"]} className={styles.settingsSection}>
                <Column spacing="s">
                  <Text size="small" strong>
                    Pricing presets
                  </Text>
                  {isMinimum ? (
                    <Text variant="secondary" size="small">
                      Using minimum pricing
                    </Text>
                  ) : null}
                  {isRecommended ? (
                    <Text variant="secondary" size="small">
                      Using recommended pricing
                    </Text>
                  ) : null}
                  <Row spacing="m">
                    <Button size="small" disabled={isMinimum} onClick={() => handleAutoFillValues("minimum")}>
                      Minimum
                    </Button>
                    <Button size="small" disabled={isRecommended} onClick={() => handleAutoFillValues("recommended")}>
                      Recommended
                    </Button>
                  </Row>
                </Column>
                <Field label="Total Rewards">
                  <TokenInput
                    token="USDC"
                    initialValue={initialTotalRewards}
                    onChange={setContestTotalRewards}
                    placeholder="USDC"
                    persistPlaceholder
                    displayTokenLabel={false}
                  />
                </Field>
                <Field label="Audit Contest Rewards" sublabel="Contest Pool + Lead fixed pay">
                  <TokenInput
                    token="USDC"
                    initialValue={initialAuditContestRewards}
                    onChange={setContestAuditRewards}
                    placeholder="USDC"
                    persistPlaceholder
                    displayTokenLabel={false}
                  />
                </Field>
                <Field label="Judging Contest Prize Pool">
                  <TokenInput
                    token="USDC"
                    initialValue={initialJudgingPrizePool}
                    onChange={setContestJudgingPrizePool}
                    placeholder="USDC"
                    persistPlaceholder
                    displayTokenLabel={false}
                  />
                </Field>
                <Field label="Lead Judge Fixed Pay">
                  <TokenInput
                    token="USDC"
                    initialValue={initialLeadJudgeFixedPay}
                    onChange={setContestLeadJudgeFixedPay}
                    placeholder="USDC"
                    persistPlaceholder
                    displayTokenLabel={false}
                  />
                </Field>
                <Field label="Total Cost">
                  <TokenInput
                    token="USDC"
                    initialValue={initialTotalCost}
                    onChange={setContestTotalCost}
                    placeholder="USDC"
                    persistPlaceholder
                    displayTokenLabel={false}
                  />
                </Field>
                <Text size="small">{`Admin Fee: ${sherlockFee} USDC`}</Text>
              </Column>
              <Column spacing="l" alignment={["stretch", "start"]} className={styles.settingsSection}>
                <RadioButton
                  label="Contest setup"
                  options={[
                    { label: "Public", value: "public" },
                    { label: "Private", value: "private" },
                    { label: "1v1", value: "1v1" },
                    { label: "Custom", value: "custom" },
                  ]}
                  value={contestSetup}
                  onChange={handleSetContestSetup}
                />
                <hr />
                <RadioButton
                  label="Visibility"
                  options={[
                    { label: "Public", value: false },
                    { label: "Private", value: true },
                  ]}
                  value={isPrivate}
                  onChange={setIsPrivate}
                />
                <RadioButton
                  label="Requires KYC"
                  options={[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ]}
                  value={requiresKYC}
                  onChange={setRequiresKYC}
                />
                <Column spacing="xs">
                  <RadioButton
                    label="Lead Senior Watson Fixed Pay"
                    options={[
                      { label: "Tiered", value: "TIERED" },
                      { label: "Best Efforts", value: "BEST_EFFORTS" },
                      { label: "Fixed", value: "FIXED" },
                    ]}
                    value={lswPaymentStructure}
                    onChange={setLswPaymentStructure}
                  />
                  <Text size="small" variant="secondary">
                    {lswPaymentStructureDetails}
                  </Text>
                  {lswPaymentStructure === "FIXED" && (
                    <TokenInput
                      token="USDC"
                      initialValue={initialCustomLswFixedPay}
                      onChange={setCustomLswFixedPay}
                      placeholder="USDC"
                      persistPlaceholder
                      displayTokenLabel={false}
                    />
                  )}
                </Column>
                <Column spacing="xs">
                  <RadioButton
                    label="Maximum number of contestants"
                    options={[
                      { label: "Unlimited", value: false },
                      { label: "Custom", value: true },
                    ]}
                    value={hasLimitedContestants}
                    onChange={setHasLimitedContestants}
                  />

                  {hasLimitedContestants && (
                    <>
                      <Input
                        placeholder="Contestans"
                        persistPlaceholder
                        value={maxNumberOfParticipants}
                        onChange={setmaxNumberOfParticipants}
                        type="number"
                      />
                      <Text size="small" variant="secondary">
                        Includes the Lead Senior Watson
                      </Text>
                    </>
                  )}
                </Column>
              </Column>
            </Row>
          </Column>
        )}
      </Column>
      <Button disabled={!canSubmit} onClick={handleSubmit}>
        {submitLabel}
      </Button>
    </Column>
  )
}
