import React from "react"
import { Route, Routes } from "react-router-dom"

import { StakingPage } from "./pages/Staking/Staking"
import { StakingPositionsPage } from "./pages/StakingPositions/StakingPositions"
import { ProtocolBalancePage } from "./pages/ProtocolBalance/ProtocolBalance"

import styles from "./App.module.scss"

function App() {
  return (
    <div className={styles.app}>
      <h1>Sherlock v2</h1>
      <Routes>
        <Route index element={<StakingPage />} />
        <Route path="stake" element={<StakingPage />} />
        <Route path="positions" element={<StakingPositionsPage />} />
        <Route path="protocol" element={<ProtocolBalancePage />} />
      </Routes>
    </div>
  )
}

export default App
