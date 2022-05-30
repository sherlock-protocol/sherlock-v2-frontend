import React from "react"
import { fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react"
import ConnectButton from "./ConnectButton"
import { renderWithContext } from "../../utils/test"

import { shortenAddress } from "../../utils/format"

describe("ConnectButton", () => {
  test("show connect message", async () => {
    renderWithContext(<ConnectButton />)

    const buttonLabel = screen.getByText("Connect")
    expect(buttonLabel).toBeInTheDocument()
  })

  test("show wallet provider modal after clicking", async () => {
    renderWithContext(<ConnectButton />)

    fireEvent.click(screen.getByText("Connect"))

    expect(screen.getByText("MetaMask")).toBeInTheDocument()
    expect(screen.getByText("WalletConnect")).toBeInTheDocument()
  })

  test("hide wallet provider modal after connecting", async () => {
    renderWithContext(<ConnectButton />)

    expect(screen.queryByText("MetaMask")).not.toBeInTheDocument()
    fireEvent.click(screen.getByText("Connect"))
    fireEvent.click(screen.getByText("MetaMask"))

    await waitForElementToBeRemoved(screen.queryByText("MetaMask"), { timeout: 5000 })

    expect(screen.queryByText("Connect")).not.toBeInTheDocument()
    expect(screen.getByText(shortenAddress("0x1111Bf7966FF93f1095a8cd101Da272a8BF47543"))).toBeInTheDocument()
  })
})
