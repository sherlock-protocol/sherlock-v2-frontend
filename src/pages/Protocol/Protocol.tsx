import { BigNumber, ethers } from "ethers"
import React from "react"
import ProtocolBalanceInput from "../../components/ProtocolBalanceInput/ProtocolBalanceInput"
import useProtocolManager, { COVERED_PROTOCOLS } from "../../hooks/useProtocolManager"
import styles from "./Protocol.module.scss"
import { convertSecondsToDurationString } from "../../utils/time"
import AllowanceGate from "../../components/AllowanceGate/AllowanceGate"
import { Button } from "../../components/Button/Button"
import useERC20 from "../../hooks/useERC20"
import ConnectGate from "../../components/ConnectGate/ConnectGate"
import useWaitTx from "../../hooks/useWaitTx"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Title } from "../../components/Title"
import { Text } from "../../components/Text"
import Select from "../../components/Select/Select"

const PROTOCOL_SELECT_OPTIONS = Object.entries(COVERED_PROTOCOLS).map(([key, item]) => ({
  label: item.name,
  value: key,
}))

export const ProtocolPage: React.FC = () => {
  const [selectedProtocol, setSelectedProtocol] = React.useState<keyof typeof COVERED_PROTOCOLS>("EULER")
  const [balance, setBalance] = React.useState<BigNumber>()
  const [coverageLeft, setCoverageLeft] = React.useState<BigNumber>()
  const [premium, setPremium] = React.useState<BigNumber>()

  /**
   * Amount to add to/remove from active balance
   */
  const [amount, setAmount] = React.useState<BigNumber>()

  const {
    address,
    getProtocolActiveBalance,
    getProtocolCoverageLeft,
    getProtocolPremium,
    depositActiveBalance,
    withdrawActiveBalance,
  } = useProtocolManager()
  const { balance: usdcBalance } = useERC20("USDC")
  const { waitForTx } = useWaitTx()

  /**
   * Handler for changing the protocol
   */
  const handleOnProtocolChanged = React.useCallback((option: string) => {
    setSelectedProtocol(option as keyof typeof COVERED_PROTOCOLS)
  }, [])

  /**
   * Fetch latest protocol details: active balance, coverage left and premium
   */
  const fetchProtocolDetails = React.useCallback(async () => {
    const protocolBalance = await getProtocolActiveBalance(selectedProtocol)
    setBalance(protocolBalance)

    const protocolCoverageleft = await getProtocolCoverageLeft(selectedProtocol)
    setCoverageLeft(protocolCoverageleft)

    const protocolPremium = await getProtocolPremium(selectedProtocol)
    setPremium(protocolPremium)
  }, [selectedProtocol, getProtocolActiveBalance, getProtocolCoverageLeft, getProtocolPremium])

  /**
   * Add balance to selected protocol
   */
  const handleAddBalance = React.useCallback(async () => {
    if (!amount) {
      return
    }

    waitForTx(async () => await depositActiveBalance(selectedProtocol, amount))

    fetchProtocolDetails()
    setAmount(undefined)
  }, [amount, selectedProtocol, depositActiveBalance, fetchProtocolDetails, waitForTx])

  /**
   * Remove balance from selected protocol
   */
  const handleRemoveBalance = React.useCallback(async () => {
    if (!amount) {
      return
    }

    await waitForTx(async () => await withdrawActiveBalance(selectedProtocol, amount))

    fetchProtocolDetails()
    setAmount(undefined)
  }, [amount, selectedProtocol, withdrawActiveBalance, fetchProtocolDetails, waitForTx])

  /**
   * Handle the inputted amount changed event
   */
  const handleOnAmountChanged = React.useCallback((amount: BigNumber | undefined) => {
    setAmount(amount)
  }, [])

  // Fetch protocol coverage information
  React.useEffect(() => {
    setAmount(undefined)
    fetchProtocolDetails()
  }, [fetchProtocolDetails])

  return (
    <Box>
      <Column spacing="m">
        <Row alignment="space-between" className={styles.header}>
          <Column>
            <Title>Protocol</Title>
          </Column>
          <Column>
            <Select options={PROTOCOL_SELECT_OPTIONS} onChange={handleOnProtocolChanged} initialOption="EULER" />
          </Column>
        </Row>
        <Row alignment="space-between">
          <Column>
            <Text>Coverage</Text>
          </Column>
          <Column>
            <Text strong>Active</Text>
          </Column>
        </Row>
        {balance && (
          <Row alignment="space-between">
            <Column>
              <Text>Active balance</Text>
            </Column>
            <Column>
              <Text strong>{ethers.utils.commify(ethers.utils.formatUnits(balance, 6))} USDC</Text>
            </Column>
          </Row>
        )}
        {coverageLeft && (
          <Row alignment="space-between">
            <Column>
              <Text>Coverage left</Text>
            </Column>
            <Column>
              <Text strong>{convertSecondsToDurationString(coverageLeft.toNumber())}</Text>
            </Column>
          </Row>
        )}
        <Column className={styles.rewardsContainer} spacing="m">
          {balance && (
            <ProtocolBalanceInput
              onChange={handleOnAmountChanged}
              protocolPremium={premium}
              usdcBalance={usdcBalance}
            />
          )}
          {amount && (
            <ConnectGate>
              <Row alignment="space-between" spacing="m">
                <Column grow={1}>
                  <Button variant="secondary" onClick={handleRemoveBalance}>
                    Remove balance
                  </Button>
                </Column>
                <Column grow={1}>
                  <AllowanceGate
                    amount={amount}
                    spender={address}
                    render={(disabled) => (
                      <Button onClick={handleAddBalance} disabled={!amount}>
                        Add balance {amount?.toString()}
                      </Button>
                    )}
                  />
                </Column>
              </Row>
            </ConnectGate>
          )}
        </Column>
      </Column>
    </Box>
  )
}
