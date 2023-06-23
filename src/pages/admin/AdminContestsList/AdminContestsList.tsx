import { Column } from "../../../components/Layout"
import { AdminContestsListActive } from "./AdminContestsListActive"
import { AdminContestsListFinished } from "./AdminContestsListFinished"

export const AdminContestsList = () => {
  return (
    <Column spacing="xl">
      <AdminContestsListActive />
      <AdminContestsListFinished />
    </Column>
  )
}
