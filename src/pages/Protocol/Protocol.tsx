import { BigNumber, ethers } from "ethers"
import React from "react"
import ProtocolBalanceInput from "../../components/ProtocolBalanceInput/ProtocolBalanceInput"
import useProtocolManager from "../../hooks/useProtocolManager"
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
import { formatAmount } from "../../utils/format"
import { useCoveredProtocols, CoveredProtocol } from "../../hooks/api/useCoveredProtocols"
import { DateTime } from "luxon"
import { useAccount } from "wagmi"

export const ProtocolPage: React.FC = () => {
  const [selectedProtocolId, setSelectedProtocolId] = React.useState<string>()
  const [balance, setBalance] = React.useState<BigNumber>()
  const [coverageLeft, setCoverageLeft] = React.useState<BigNumber>()

  const { data: coveredProtocols, getCoveredProtocols } = useCoveredProtocols()
  const [{ data: accountData }] = useAccount()

  const protocolSelectOptions = React.useMemo(
    () =>
      Object.entries(coveredProtocols)?.map(([key, item]) => ({
        label: item.name ?? "Unknown",
        value: key,
      })) ?? [],
    [coveredProtocols]
  )
  const selectedProtocol = React.useMemo<CoveredProtocol | null>(
    () => (selectedProtocolId ? coveredProtocols?.[selectedProtocolId] ?? null : null),
    [selectedProtocolId, coveredProtocols]
  )

  /**
   * Amount to add to/remove from active balance
   */
  const [amount, setAmount] = React.useState<BigNumber>()

  const { address, getProtocolActiveBalance, getProtocolCoverageLeft, depositActiveBalance, withdrawActiveBalance } =
    useProtocolManager()
  const { balance: usdcBalance } = useERC20("USDC")
  const { waitForTx } = useWaitTx()

  /**
   * Handler for changing the protocol
   */
  const handleOnProtocolChanged = React.useCallback((option: string) => {
    setSelectedProtocolId(option)
  }, [])

  /**
   * Fetch latest protocol details: active balance, coverage left and premium
   */
  const fetchProtocolDetails = React.useCallback(async () => {
    if (!selectedProtocolId) {
      return
    }

    const protocolBalance = await getProtocolActiveBalance(selectedProtocolId)
    setBalance(protocolBalance)

    const protocolCoverageleft = await getProtocolCoverageLeft(selectedProtocolId)
    setCoverageLeft(protocolCoverageleft)
  }, [selectedProtocolId, getProtocolActiveBalance, getProtocolCoverageLeft])

  /**
   * Add balance to selected protocol
   */
  const handleAddBalance = React.useCallback(async () => {
    if (!amount || !selectedProtocolId) {
      return false
    }

    await waitForTx(async () => await depositActiveBalance(selectedProtocolId, amount))

    return true
  }, [amount, selectedProtocolId, depositActiveBalance, waitForTx])

  /**
   * Remove balance from selected protocol
   */
  const handleRemoveBalance = React.useCallback(async () => {
    if (!amount || !selectedProtocolId) {
      return
    }

    await waitForTx(async () => await withdrawActiveBalance(selectedProtocolId, amount))

    fetchProtocolDetails()
    setAmount(undefined)
  }, [amount, selectedProtocolId, withdrawActiveBalance, fetchProtocolDetails, waitForTx])

  /**
   * Handle the inputted amount changed event
   */
  const handleOnAmountChanged = React.useCallback((amount: BigNumber | undefined) => {
    setAmount(amount)
  }, [])

  // Fetch covered protocols
  React.useEffect(() => {
    const fetchCoveredProtocols = async () => {
      await getCoveredProtocols()
    }
    fetchCoveredProtocols()
  }, [getCoveredProtocols])

  // Fetch protocol coverage information
  React.useEffect(() => {
    fetchProtocolDetails()
  }, [fetchProtocolDetails])

  const maxClaimableAmount = React.useMemo(() => {
    if (selectedProtocol) {
      const [current, previous] = selectedProtocol.coverages.map((item) => item.coverageAmount)

      if (previous?.gt(current)) {
        return previous
      } else {
        return current
      }
    }

    return null
  }, [selectedProtocol])

  return (
    <Box>
      <Column spacing="m">
        <Row alignment="space-between" className={styles.header}>
          <Column>
            <Title>Protocol</Title>
          </Column>
          <Column>
            <Select value={selectedProtocolId} options={protocolSelectOptions} onChange={handleOnProtocolChanged} />
          </Column>
        </Row>
        {selectedProtocol && (
          <>
            <Row alignment="space-between">
              <Column>
                <Text>Coverage</Text>
              </Column>
              <Column>
                <Text strong>
                  {!selectedProtocol?.coverageEndedAt
                    ? "Active"
                    : `Ended ${DateTime.fromJSDate(selectedProtocol?.coverageEndedAt)
                        .setLocale("en")
                        .toLocaleString(DateTime.DATETIME_MED)}`}
                </Text>
              </Column>
            </Row>
            {maxClaimableAmount && (
              <Row alignment="space-between">
                <Column>
                  <Text>Claimable up to</Text>
                </Column>
                <Column>
                  <Text strong>{formatAmount(ethers.utils.formatUnits(maxClaimableAmount, 6))} USDC</Text>
                </Column>
              </Row>
            )}
            {balance && (
              <Row alignment="space-between">
                <Column>
                  <Text>Active balance</Text>
                </Column>
                <Column>
                  <Text strong>{formatAmount(ethers.utils.formatUnits(balance, 6))} USDC</Text>
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
                  protocolPremium={selectedProtocol.premium}
                  usdcBalance={usdcBalance}
                />
              )}
              {amount && (
                <Row alignment="center">
                  <ConnectGate>
                    <Column grow={1} alignment="start" spacing="m">
                      <AllowanceGate
                        amount={amount}
                        spender={address}
                        actionName="Add Balance"
                        action={handleAddBalance}
                        onSuccess={fetchProtocolDetails}
                      />
                      {accountData?.address === selectedProtocol?.agent && (
                        <Row>
                          <Column grow={1}>
                            <Button variant="secondary" onClick={handleRemoveBalance}>
                              Remove balance
                            </Button>
                          </Column>
                        </Row>
                      )}
                    </Column>
                  </ConnectGate>
                </Row>
              )}
            </Column>
          </>
        )}
      </Column>
    </Box>
  )
}
