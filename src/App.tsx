import React from "react"
import { Route, Routes } from "react-router-dom"

import { StakingPage } from "./pages/Staking"
import { StakingPositionsPage } from "./pages/StakingPositions"
import { FundraisingPage } from "./pages/Fundraising"
import { ProtocolPage } from "./pages/Protocol"

import styles from "./App.module.scss"
import Header from "./components/Header/Header"

function App() {
  return (
    <div className={styles.app}>
      <Header />
      <h1>Sherlock v2</h1>
      <Routes>
        <Route index element={<StakingPage />} />
        <Route path="stake" element={<StakingPage />} />
        <Route path="positions" element={<StakingPositionsPage />} />
        <Route path="fundraise" element={<FundraisingPage />} />
        <Route path="protocol" element={<ProtocolPage />} />
      </Routes>
    </div>
  )
}

export default App
