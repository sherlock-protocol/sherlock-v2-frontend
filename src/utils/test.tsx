import React from "react"
import { render } from "@testing-library/react"
import { WagmiProvider } from "./WagmiProvider"
import { MemoryRouter } from "react-router-dom"
import { TxWaitProvider } from "../hooks/useWaitTx"
import { FundraisePositionProvider } from "../hooks/api/useFundraisePosition"
import { StakingPositionsProvider } from "../hooks/api/useStakingPositions"
import { CoveredProtocolsProvider } from "../hooks/api/useCoveredProtocols"

export const renderWithContext = (ui) => {
  return render(
    <MemoryRouter>
      <WagmiProvider>
        <TxWaitProvider>
          <FundraisePositionProvider>
            <StakingPositionsProvider>
              <CoveredProtocolsProvider>{ui}</CoveredProtocolsProvider>
            </StakingPositionsProvider>
          </FundraisePositionProvider>
        </TxWaitProvider>
      </WagmiProvider>
    </MemoryRouter>
  )
}
