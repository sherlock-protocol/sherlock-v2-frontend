import React from "react"
import { Route, Routes } from "react-router-dom"

import { StakingPage } from "./pages/Staking"
import { StakingPositionsPage } from "./pages/StakingPositions"
import { FundraisingPage } from "./pages/Fundraising"
import { FundraisingClaimPage } from "./pages/FundraisingClaim"
import { ProtocolPage } from "./pages/Protocol"

import { Footer } from "./components/Footer"

import styles from "./App.module.scss"
import Header from "./components/Header/Header"

function App() {
  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.content}>
        <Routes>
          <Route index element={<StakingPage />} />
          <Route path="stake" element={<StakingPage />} />
          <Route path="positions" element={<StakingPositionsPage />} />
          <Route path="fundraise" element={<FundraisingPage />} />
          <Route path="fundraiseclaim" element={<FundraisingClaimPage />} />
          <Route path="protocol" element={<ProtocolPage />} />
        </Routes>
      </div>
      <Footer>
        <small>Sherlock v2</small>
      </Footer>
    </div>
  )
}

export default App
