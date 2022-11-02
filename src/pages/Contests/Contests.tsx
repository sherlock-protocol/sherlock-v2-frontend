import React, { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Box } from "../../components/Box"
import { Button } from "../../components/Button"

import { Column, Row } from "../../components/Layout"
import { Title } from "../../components/Title"
import { useContests } from "../../hooks/api/contests"
import { ActiveContests } from "./ActiveContests"
import { AuditorSignUpModal } from "./AuditorSignUpModal"

import styles from "./Contests.module.scss"
import { FinishedContests } from "./FinishedContests"
import { UpcomingContests } from "./UpcomingContests"
import { useIsAuditor } from "../../hooks/api/auditors"
import { useAccount } from "wagmi"
import ConnectGate from "../../components/ConnectGate/ConnectGate"

export const ContestsPage: React.FC<{}> = () => {
  const { address: connectedAddress } = useAccount()
  const { data: contests } = useContests()
  const { data: isAuditor } = useIsAuditor(connectedAddress)
  const navigate = useNavigate()
  const [signUpFormModalOpen, setSignUpFormModalOpen] = useState(false)

  const handleContestClick = useCallback(
    (id: number) => {
      navigate(`${id}`)
    },
    [navigate]
  )

  const handleSignUpModalClose = useCallback(() => {
    setSignUpFormModalOpen(false)
  }, [setSignUpFormModalOpen])

  return (
    <Column spacing="m" className={styles.container}>
      {!isAuditor && (
        <Box shadow={false}>
          <Row spacing="xl" alignment={["start", "center"]}>
            <Title variant="h2">Not a Watson yet?</Title>
            <ConnectGate>
              <Button onClick={() => setSignUpFormModalOpen(true)}>Sign up</Button>
            </ConnectGate>
          </Row>
        </Box>
      )}

      <ActiveContests contests={contests} onContestClick={handleContestClick} />
      <UpcomingContests contests={contests} onContestClick={handleContestClick} />
      <FinishedContests contests={contests} onContestClick={handleContestClick} />
      {signUpFormModalOpen && <AuditorSignUpModal closeable onClose={handleSignUpModalClose} />}
    </Column>
  )
}
