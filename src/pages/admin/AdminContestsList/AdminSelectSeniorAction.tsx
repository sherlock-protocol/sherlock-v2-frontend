import { useCallback, useEffect, useState } from "react"
import { useDebounce } from "use-debounce"
import { Button } from "../../../components/Button"
import { Input } from "../../../components/Input"
import { Column, Row } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import { Text } from "../../../components/Text"
import { useAdminSelectLeadSeniorWatson } from "../../../hooks/api/admin/useAdminSelectLeadSeniorWatson"
import { useAdminSeniorWatson } from "../../../hooks/api/admin/useAdminSeniorWatson"
import { useAdminStartLeadSeniorWatsonSelection } from "../../../hooks/api/admin/useAdminStartLeadSeniorWatsonSelection"
import { ErrorModal } from "../../ContestDetails/ErrorModal"
import { AdminActionHeader } from "./AdminActionHeader"
import { ActionProps } from "./ConfirmContestActionModal"

type Props = Omit<ActionProps, "action">

export const AdminSelectSeniorAction: React.FC<Props> = ({ contest, force, onCancel, onConfirm }) => {
  const [seniorWatsonHandle, setSeniorWatsonHandle] = useState("")
  const [debouncedSeniorWatsonHandle] = useDebounce(seniorWatsonHandle, 300)

  const { data: seniorWatson, isLoading, isError, error } = useAdminSeniorWatson(debouncedSeniorWatsonHandle)

  const {
    startLeadSeniorWatsonSelection,
    isLoading: startSeniorWatsonSelectionLoading,
    error: startSeniorWatsonSelectionError,
    isSuccess: startSeniorWatsonSelectionSuccess,
    reset: startSeniorWatsonSelectionReset,
  } = useAdminStartLeadSeniorWatsonSelection()
  const {
    selectLeadSeniorWatson,
    isLoading: selectLeadSeniorWatsonLoading,
    isSuccess: selectLeadSeniorWatsonSuccess,
    error: selectLeadSeniorWatsonError,
    reset: selectLeadSeniorWatsonReset,
  } = useAdminSelectLeadSeniorWatson()

  useEffect(() => {
    if (selectLeadSeniorWatsonSuccess || startSeniorWatsonSelectionSuccess) {
      onConfirm()
    }
  }, [startSeniorWatsonSelectionSuccess, selectLeadSeniorWatsonSuccess, onConfirm])

  const handleStartLeadSeniorWatsonSelectionClick = useCallback(() => {
    startLeadSeniorWatsonSelection({
      contestID: contest.id,
      force,
    })
  }, [startLeadSeniorWatsonSelection, contest.id, force])

  const handleSelectLeadSeniorWatsonClick = useCallback(() => {
    if (!seniorWatson) return

    selectLeadSeniorWatson({
      seniorWatsonID: seniorWatson.id,
      contestID: contest.id,
      force,
    })
  }, [selectLeadSeniorWatson, seniorWatson, contest.id, force])

  const handleErrorModalClose = useCallback(() => {
    startSeniorWatsonSelectionReset()
    selectLeadSeniorWatsonReset()
  }, [startSeniorWatsonSelectionReset, selectLeadSeniorWatsonReset])

  return (
    <LoadingContainer loading={startSeniorWatsonSelectionLoading || selectLeadSeniorWatsonLoading}>
      <Column alignment={["center", "start"]} spacing="l">
        <AdminActionHeader contest={contest} title="Select Lead Senior Watson" />
        <Column spacing="s" alignment={"center"}>
          <Button onClick={handleStartLeadSeniorWatsonSelectionClick}>Start Lead Senior Watson selection</Button>
        </Column>
        <Text>or</Text>
        <Column spacing="s">
          <Text>Manually select a Lead Senior Watson by typing their handle</Text>
        </Column>
        <Column spacing="xs">
          <Row spacing="s">
            <Input value={seniorWatsonHandle} onChange={setSeniorWatsonHandle} />
            <Button
              disabled={isLoading || isError || debouncedSeniorWatsonHandle === ""}
              onClick={handleSelectLeadSeniorWatsonClick}
            >
              Select
            </Button>
          </Row>
          {error && <Text variant="warning">{error?.message}</Text>}
        </Column>
        <Row spacing="l">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </Row>
      </Column>
      {startSeniorWatsonSelectionError && (
        <ErrorModal reason={startSeniorWatsonSelectionError.message} onClose={handleErrorModalClose} />
      )}
      {selectLeadSeniorWatsonError && (
        <ErrorModal reason={selectLeadSeniorWatsonError.message} onClose={handleErrorModalClose} />
      )}
    </LoadingContainer>
  )
}
