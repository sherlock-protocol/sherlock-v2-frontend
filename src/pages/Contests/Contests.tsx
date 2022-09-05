import React, { useCallback } from "react"
import { useNavigate } from "react-router-dom"

import { Column } from "../../components/Layout"
import { useContests } from "../../hooks/api/contests"
import { ActiveContests } from "./ActiveContests"

import styles from "./Contests.module.scss"
import { UpcomingContests } from "./UpcomingContests"

export const ContestsPage: React.FC<{}> = () => {
  const { data: contests } = useContests()
  const navigate = useNavigate()

  const handleContestClick = useCallback(
    (id: number) => {
      navigate(`${id}`)
    },
    [navigate]
  )

  return (
    <Column spacing="m" className={styles.container}>
      <ActiveContests contests={contests} onContestClick={handleContestClick} />
      <UpcomingContests contests={contests} onContestClick={handleContestClick} />
    </Column>
  )
}
