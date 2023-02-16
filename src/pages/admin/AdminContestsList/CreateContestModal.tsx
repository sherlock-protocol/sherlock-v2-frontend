import { BigNumber, ethers } from "ethers"
import { DateTime } from "luxon"
import { useCallback, useEffect, useMemo, useState } from "react"
import { FaChrome, FaTwitter } from "react-icons/fa"
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
  const [protocolWebsite, setProtocolWebsite] = useState(protocol?.website ?? "")
  const [protocolLogoURL, setProtocolLogoURL] = useState(protocol?.logoURL ?? "")

  const [contestTitle, setContestTitle] = useState("")
  const [contestShortDescription, setShortDescription] = useState("")
  const [contestStartDate, setContestStartDate] = useState("")
  const [contestAuditLength, setContestAuditLength] = useState("")
  const [contestJudgingContestEndDate, setContestJudgingContestEndDate] = useState("")
  const [contestAuditPrizePool, setContestAuditPrizePool] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [contestLeadSeniorWatsonFixedPay, setContestLeadSeniorWatsonFixedPay] = useState<BigNumber | undefined>(
    BigNumber.from(0)
  )
  const [contestJudgingPrizePool, setContestJudgingPrizePool] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [contestTotalCost, setContestTotalCost] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [initialLeadSeniorWatsonFixedPay, setInitialLeadSeniorWatsonFixedPay] = useState<BigNumber | undefined>(
    BigNumber.from(0)
  )
  const [initialJudgingPrizePool, setInitialJudgingPrizePool] = useState<BigNumber | undefined>(BigNumber.from(0))
  const [initialTotalCost, setInitialTotalCost] = useState<BigNumber | undefined>(BigNumber.from(0))

  const [startDateError, setStartDateError] = useState<string>()

  const [displayModalCloseConfirm, setDisplayModalFormConfirm] = useState(false)

  const displayProtocolInfo = !!protocol || protocolNotFound || protocolLoading

  const updateDates = useCallback(() => {
    if (contestStartDate !== "" && contestAuditLength !== "") {
      const startDate = DateTime.fromFormat(contestStartDate, DATE_FORMAT)
      const endDate = startDate.plus({ hours: 24 * parseInt(contestAuditLength) })
      const judgingEndDate = endDate.plus({ hours: 24 * 3 })

      setContestJudgingContestEndDate(judgingEndDate.toFormat(DATE_FORMAT))
    }
  }, [contestStartDate, contestAuditLength, setContestJudgingContestEndDate])

  useEffect(() => {
    if (isSuccess) onClose?.()
  }, [isSuccess, onClose])

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

    updateDates()

    if (startDate < DateTime.now()) {
      setStartDateError("Start date cannot be in the past.")
      return
    }

    setStartDateError(undefined)
  }, [contestStartDate, updateDates, contestAuditLength])

  useEffect(() => {
    if (!contestAuditPrizePool) return

    const fixedPay = contestAuditPrizePool.div(10).mul(4)
    const judgingPool = contestAuditPrizePool.div(100).mul(5)

    setInitialLeadSeniorWatsonFixedPay(fixedPay)
    setInitialJudgingPrizePool(judgingPool)
  }, [contestAuditPrizePool, setInitialLeadSeniorWatsonFixedPay, setInitialJudgingPrizePool, setInitialTotalCost])

  useEffect(() => {
    const total = contestAuditPrizePool
      ?.add(contestLeadSeniorWatsonFixedPay ?? 0)
      .add(contestJudgingPrizePool ?? 0)
      .add(contestAuditPrizePool.div(100).mul(5))
    setInitialTotalCost(total)
  }, [contestAuditPrizePool, contestLeadSeniorWatsonFixedPay, contestJudgingPrizePool])

  const sherlockFee = useMemo(() => {
    const fee = contestTotalCost
      ?.sub(contestAuditPrizePool ?? 0)
      .sub(contestLeadSeniorWatsonFixedPay ?? 0)
      .sub(contestJudgingPrizePool ?? 0)

    return commify(parseInt(ethers.utils.formatUnits(fee ?? 0, 6)))
  }, [contestAuditPrizePool, contestLeadSeniorWatsonFixedPay, contestJudgingPrizePool, contestTotalCost])

  const canCreateContest = useMemo(() => {
    if (protocolName === "") return false
    if (protocolLogoURL === "" && !protocol?.logoURL) return false
    if (protocolWebsite === "" && !protocol?.website) return false
    if (protocolTwitter === "" && !protocol?.twitter) return false

    if (contestTitle === "") return false
    if (contestShortDescription === "") return false

    if (contestAuditLength === "") return false

    const startDate = DateTime.fromFormat(contestStartDate, DATE_FORMAT)
    const endDate = startDate.plus({ hours: 24 * parseInt(contestAuditLength) })
    const judgingEndDate = endDate.plus({ hours: 24 * 3 })

    if (!startDate.isValid) return false
    if (startDate < DateTime.now()) return false

    if (!judgingEndDate.isValid) return false
    if (judgingEndDate < endDate) return false

    if (contestAuditPrizePool?.eq(BigNumber.from(0))) return false
    if (contestLeadSeniorWatsonFixedPay?.eq(BigNumber.from(0))) return false
    if (contestTotalCost?.eq(BigNumber.from(0))) return false

    return true
  }, [
    contestAuditLength,
    contestAuditPrizePool,
    contestLeadSeniorWatsonFixedPay,
    contestShortDescription,
    contestStartDate,
    contestTitle,
    contestTotalCost,
    protocol?.logoURL,
    protocol?.twitter,
    protocol?.website,
    protocolLogoURL,
    protocolName,
    protocolTwitter,
    protocolWebsite,
  ])

  const handleCreateContest = useCallback(() => {
    const startDate = DateTime.fromFormat(contestStartDate, DATE_FORMAT)
    const endDate = startDate.plus({ hours: 24 * parseInt(contestAuditLength) })
    const judgingEndDate = DateTime.fromFormat(contestJudgingContestEndDate, DATE_FORMAT)

    createContest({
      protocol: {
        id: protocol?.id,
        githubTeam: protocolName,
        website: protocolWebsite,
        twitter: protocolTwitter,
        logoUrl: protocolLogoURL,
      },
      contest: {
        title: contestTitle,
        shortDescription: contestShortDescription,
        startDate,
        endDate,
        judgingEndDate,
        auditPrizePool: parseInt(ethers.utils.formatUnits(contestAuditPrizePool ?? 0, 6)),
        judgingPrizePool: parseInt(ethers.utils.formatUnits(contestJudgingPrizePool ?? 0, 6)),
        leadSeniorAuditorFixedPay: parseInt(ethers.utils.formatUnits(contestLeadSeniorWatsonFixedPay ?? 0, 6)),
        fullPayment: parseInt(ethers.utils.formatUnits(contestTotalCost ?? 0, 6)),
      },
    })
  }, [
    contestAuditLength,
    contestAuditPrizePool,
    contestJudgingContestEndDate,
    contestJudgingPrizePool,
    contestLeadSeniorWatsonFixedPay,
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
  ])

  const formIsDirty = useMemo(
    () =>
      protocolName !== "" ||
      contestTitle !== "" ||
      contestShortDescription !== "" ||
      contestStartDate !== "" ||
      contestAuditLength !== "" ||
      contestJudgingContestEndDate !== "" ||
      contestAuditPrizePool?.gt(BigNumber.from(0)) ||
      contestLeadSeniorWatsonFixedPay?.gt(BigNumber.from(0)) ||
      contestJudgingPrizePool?.gt(BigNumber.from(0)) ||
      contestTotalCost?.gt(BigNumber.from(0)),
    [
      contestAuditLength,
      contestAuditPrizePool,
      contestJudgingContestEndDate,
      contestJudgingPrizePool,
      contestLeadSeniorWatsonFixedPay,
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
              <Input value={protocolName} onChange={setProtocolName} />
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
          <Column spacing="m">
            <Title variant="h3">CONTEST</Title>
            <Field label="Title">
              <Input value={contestTitle} onChange={setContestTitle} />
            </Field>
            <Field label="Short Description">
              <Input value={contestShortDescription} onChange={setShortDescription} />
            </Field>
            <Field label="Start Date" error={!!startDateError} errorMessage={startDateError ?? ""}>
              <Input value={contestStartDate} onChange={setContestStartDate} />
            </Field>
            <Field label="Audit Length">
              <Input type="number" value={contestAuditLength} onChange={setContestAuditLength} />
            </Field>
            <Field label="Judging Contest End Date">
              <Input value={contestJudgingContestEndDate} onChange={setContestJudgingContestEndDate} />
            </Field>
            <Field label="Audit Contest Prize Pool">
              <TokenInput token="USDC" onChange={setContestAuditPrizePool} />
            </Field>
            <Field label="Lead Senior Watson Fixed Pay">
              <TokenInput
                token="USDC"
                initialValue={initialLeadSeniorWatsonFixedPay}
                onChange={setContestLeadSeniorWatsonFixedPay}
              />
            </Field>
            <Field label="Judging Contest Prize Pool">
              <TokenInput token="USDC" initialValue={initialJudgingPrizePool} onChange={setContestJudgingPrizePool} />
            </Field>
            <Field label="Total Cost" detail={`Sherlock fee will be ${sherlockFee} USDC`}>
              <TokenInput token="USDC" initialValue={initialTotalCost} onChange={setContestTotalCost} />
            </Field>
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
