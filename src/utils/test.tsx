import React from "react"
import { render } from "@testing-library/react"
import { WagmiProvider } from "./WagmiProvider"
import { MemoryRouter } from "react-router-dom"
import { TxWaitProvider } from "../hooks/useWaitTx"
import { FundraisePositionProvider } from "../hooks/api/useFundraisePosition"
import { StakingPositionsProvider } from "../hooks/api/useStakingPositions"
import { CoveredProtocolsProvider } from "../hooks/api/useCoveredProtocols"

import { InjectedConnector } from "wagmi/connectors/injected"
import { defaultChains, developmentChains } from "wagmi"
import { ethers } from "ethers"

const chains = [...defaultChains, ...developmentChains]

export function getProvider({ chainId }: { chainId?: number } = {}) {
  return new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/")
}

const localProvider = getProvider()
const signer = localProvider.getSigner("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")

class MockConnector extends InjectedConnector {
  constructor(config: { chains?: Chain[] }) {
    super(config, {
      signer,
    })
  }
}

export const renderWithContext = (ui) => {
  return render(
    <MemoryRouter>
      <WagmiProvider connectors={({ chainId }) => [new MockConnector({ chains })]} provider={getProvider}>
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
