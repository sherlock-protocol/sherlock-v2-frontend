import { DateTime } from "luxon"
import { useCallback, useEffect, useState } from "react"
import { FaChrome, FaTwitter } from "react-icons/fa"
import { useDebounce } from "use-debounce"
import { Input } from "../../../components/Input"
import { Column, Row } from "../../../components/Layout"
import Modal, { Props as ModalProps } from "../../../components/Modal/Modal"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import { useAdminProtocol } from "../../../hooks/api/admin/useAdminProtocol"
import { Field } from "../../Claim/Field"

type Props = ModalProps & {}

export const CreateContestModal: React.FC<Props> = ({ onClose }) => {
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

  const [contestTitle, setContestTitle] = useState("")
  const [contestShortDescription, setShortDescription] = useState("")
  const [contestStartDate, setContestStartDate] = useState("")
  const [contestAuditLength, setContestAuditLength] = useState("")
  const [contestJudgingContestEndDate, setContestJudgingContestEndDate] = useState("")
  const [contestAuditPrizePool, setContestAuditPrizePool] = useState("")
  const [contestLeadSeniorWatsonFixedPay, setContestLeadSeniorWatsonFixedPay] = useState("")
  const [contestJudgingPrizePool, setContestJudgingPrizePool] = useState("")
  const [contestTotalCost, setContestTotalCost] = useState("")

  const [startDateIsInvalid, setStartDateIsInvalid] = useState(false)

  const displayProtocolInfo = !!protocol || protocolNotFound || protocolLoading

  const updateDates = useCallback(() => {
    if (contestStartDate !== "" && contestAuditLength !== "") {
      const startDate = DateTime.fromFormat(contestStartDate, "yyyy-MM-dd HH:mm")
      const endDate = startDate.plus({ hours: 24 * parseInt(contestAuditLength) })
      const judgingEndDate = endDate.plus({ hours: 24 * 3 })

      setContestJudgingContestEndDate(judgingEndDate.toFormat("yyyy-MM-dd HH:mm"))
    }
  }, [contestStartDate, contestAuditLength, setContestJudgingContestEndDate])

  useEffect(() => {
    if (contestStartDate === "") {
      setStartDateIsInvalid(false)
    } else {
      const startDate = DateTime.fromFormat(contestStartDate, "yyyy-MM-dd HH:mm")

      console.log(startDate.toLocaleString(DateTime.DATETIME_FULL))

      if (!startDate.isValid) {
        setStartDateIsInvalid(true)
      } else {
        setStartDateIsInvalid(false)
        updateDates()
      }
    }
  }, [contestStartDate, updateDates, contestAuditLength])

  return (
    <Modal closeable onClose={onClose}>
      <Column spacing="xl">
        <Title>Create new contest</Title>
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
                  {protocol?.logoURL && <img src={protocol?.logoURL} alt="logo preview" width={30} height={30} />}
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
          <Field
            label="Start Date"
            error={startDateIsInvalid}
            errorMessage="Invalid date. Must be format yyyy-MM-dd HH:mm"
          >
            <Input value={contestStartDate} onChange={setContestStartDate} />
          </Field>
          <Field label="Audit Length">
            <Input value={contestAuditLength} onChange={setContestAuditLength} />
          </Field>
          <Field label="Judging Contest End Date">
            <Input value={contestJudgingContestEndDate} onChange={setContestJudgingContestEndDate} />
          </Field>
          <Field label="Audit Contest Prize Pool">
            <Input value={contestAuditPrizePool} onChange={setContestAuditPrizePool} />
          </Field>
          <Field label="Lead Senior Watson Fixed Pay">
            <Input value={contestLeadSeniorWatsonFixedPay} onChange={setContestLeadSeniorWatsonFixedPay} />
          </Field>
          <Field label="Judging Contest Prize Pool">
            <Input value={contestJudgingPrizePool} onChange={setContestJudgingPrizePool} />
          </Field>
          <Field label="Total Cost">
            <Input value={contestTotalCost} onChange={setContestTotalCost} />
          </Field>
        </Column>
      </Column>
    </Modal>
  )
}
