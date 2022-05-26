import React from "react"
import { screen } from "@testing-library/react"
import { StakingPage } from "./Staking"
import { renderWithContext } from "../../utils/test"

test("TVL and APY visible", async () => {
  renderWithContext(<StakingPage />)
  const TVL = screen.getByText(/Total Value Locked/i)

  console.log(TVL)
  expect(TVL).toBeInTheDocument()

  await screen.findByText("USDC APY")
  const APY = screen.getByText(/USDC APY/i)
  expect(APY).toBeInTheDocument()
})
