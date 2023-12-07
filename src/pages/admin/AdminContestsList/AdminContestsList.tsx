import { Column } from "../../../components/Layout"
import { AdminContestListDraft } from "./AdminContestListDraft"
import { AdminContestsListActive } from "./AdminContestsListActive"
import { AdminContestsListFinished } from "./AdminContestsListFinished"

export const AdminContestsList = () => {
  return (
    <Column spacing="xl">
      <AdminContestListDraft />
      <AdminContestsListActive />
      <AdminContestsListFinished />
    </Column>
  )
}
