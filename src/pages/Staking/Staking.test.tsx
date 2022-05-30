import React from "react"
import { screen } from "@testing-library/react"
import { StakingPage } from "./Staking"
import { renderWithContext } from "../../utils/test"

const mockGetStakingPositions = jest.fn(() => null)

jest.mock("../../hooks/api/useStakingPositions", () => {
  const useStakingPositionsHook = jest.requireActual("../../hooks/api/useStakingPositions")

  return {
    __esModule: true,
    ...useStakingPositionsHook,
    useStakingPositions: () => ({
      getStakingPositions: mockGetStakingPositions,
      data: {
        usdcAPY: 3.14,
      },
    }),
  }
})

test("TVL and APY visible immediately", async () => {
  renderWithContext(<StakingPage />)
  expect(mockGetStakingPositions).toBeCalled()

  const TVL = screen.getByText(/Total Value Locked/i)

  expect(TVL).toBeInTheDocument()

  const APY = screen.getByText(/USDC APY/i)
  expect(APY).toBeInTheDocument()
})
