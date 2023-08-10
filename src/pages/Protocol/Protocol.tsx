import { BigNumber, ethers } from "ethers"
import React, { useEffect } from "react"
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
import { useProtocols, Protocol } from "../../hooks/api/protocols"
import { DateTime } from "luxon"
import { useAccount } from "wagmi"
import { useParams } from "react-router-dom"

export const ProtocolPage: React.FC = () => {
  const [selectedProtocolId, setSelectedProtocolId] = React.useState<`0x${string}`>()
  const [balance, setBalance] = React.useState<BigNumber>()
  const [coverageLeft, setCoverageLeft] = React.useState<BigNumber>()

  const { data: protocols } = useProtocols()
  const { address: connectedAddress } = useAccount()

  const protocolSelectOptions = React.useMemo(
    () =>
      Object.entries(protocols ?? {})
        .filter(([_, p]) => p.agent !== ethers.constants.AddressZero)
        .map(([key, item]) => ({
          label: item.name ?? "Unknown",
          value: key as `0x${string}`,
        })) ?? [],
    [protocols]
  )
  const selectedProtocol = React.useMemo<Protocol | null>(
    () => (selectedProtocolId ? protocols?.[selectedProtocolId] ?? null : null),
    [selectedProtocolId, protocols]
  )

  /**
   * Amount to add to/remove from active balance
   */
  const [amount, setAmount] = React.useState<BigNumber>()

  const { address, getProtocolActiveBalance, getProtocolCoverageLeft, depositActiveBalance, withdrawActiveBalance } =
    useProtocolManager()
  const { balance: usdcBalance } = useERC20("USDC")
  const { waitForTx } = useWaitTx()

  const { protocolTag } = useParams()

  useEffect(() => {
    if (!protocols) return

    if (protocolTag) {
      const found = Object.entries(protocols).find(
        ([_, p]) => p.name && p.name.toLowerCase().replaceAll(" ", "_") === protocolTag
      )

      if (found) {
        const [_, protocol] = found
        setSelectedProtocolId(protocol.bytesIdentifier)
      }
    }
  }, [protocolTag, protocols])

  /**
   * Handler for changing the protocol
   */
  const handleOnProtocolChanged = React.useCallback((option: `0x${string}`) => {
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

    try {
      await waitForTx(async () => await depositActiveBalance(selectedProtocolId, amount))
    } catch (e) {
      return false
    }

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

  // Fetch protocol coverage information
  React.useEffect(() => {
    fetchProtocolDetails()
  }, [fetchProtocolDetails])

  const maxClaimableAmount = React.useMemo(() => {
    if (!selectedProtocol) return undefined

    const [current] = selectedProtocol.coverages.sort(
      (a, b) => b.coverageAmountSetAt.getTime() - a.coverageAmountSetAt.getTime()
    )
    const coverage = selectedProtocol.tvl?.lt(current.coverageAmount) ? selectedProtocol.tvl : current.coverageAmount

    return coverage
  }, [selectedProtocol])

  return (
    <Box>
      <Column spacing="m">
        <Row alignment="space-between" className={styles.header}>
          <Column>
            <Title>Protocol</Title>
          </Column>
          <Column>
            {protocolTag ? (
              <Text strong variant="alternate" size="large">
                {selectedProtocol?.name}
              </Text>
            ) : (
              <Select value={selectedProtocolId} options={protocolSelectOptions} onChange={handleOnProtocolChanged} />
            )}
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
                      {connectedAddress === selectedProtocol?.agent && (
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
