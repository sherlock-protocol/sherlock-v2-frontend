import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import { Box } from "../../../components/Box"
import { Button } from "../../../components/Button"
import { Column, Row } from "../../../components/Layout"
import { AdminContestListDraft } from "./AdminContestListDraft"
import { AdminContestsListActive } from "./AdminContestsListActive"
import { AdminContestsListFinished } from "./AdminContestsListFinished"
import { CreateContestModal } from "./CreateContestModal"

export const AdminContestsList = () => {
  const [createContestModalOpen, setCreateContestModalOpen] = useState(false)

  return (
    <Column spacing="xl">
      <Box shadow={false} fullWidth>
        <Row alignment="center">
          <Button variant="alternate" onClick={() => setCreateContestModalOpen(true)}>
            <FaPlus />
            &nbsp;Create contest
          </Button>
        </Row>
      </Box>
      <AdminContestListDraft />
      <AdminContestsListActive />
      <AdminContestsListFinished />
      {createContestModalOpen && <CreateContestModal onClose={() => setCreateContestModalOpen(false)} />}
    </Column>
  )
}
