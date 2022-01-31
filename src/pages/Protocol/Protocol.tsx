import { BigNumber, ethers } from "ethers"
import React from "react"
import ProtocolBalanceInput from "../../components/ProtocolBalanceInput/ProtocolBalanceInput"
import useProtocolManager, { COVERED_PROTOCOLS } from "../../hooks/useProtocolManager"
import styles from "./Protocol.module.scss"
import { convertSecondsToDurationString } from "../../utils/time"
import useUSDC from "../../hooks/useUSDC"

export const ProtocolPage: React.FC = () => {
  const [selectedProtocol, setSelectedProtocol] = React.useState<keyof typeof COVERED_PROTOCOLS>("SQUEETH")
  const [balance, setBalance] = React.useState<BigNumber>()
  const [coverageLeft, setCoverageLeft] = React.useState<BigNumber>()
  const [premium, setPremium] = React.useState<BigNumber>()

  const { getProtocolActiveBalance, getProtocolCoverageLeft, getProtocolPremium } = useProtocolManager()
  const { balance: usdcBalance } = useUSDC()

  /**
   * Handler for changing the protocol
   */
  const handleOnProtocolChanged = React.useCallback((e) => {
    setSelectedProtocol(e.target.value)
  }, [])

  /**
   * Add balance to selected protocol
   */
  const handleAddBalance = React.useCallback((amount: BigNumber) => {
    if (!amount) {
      return
    }

    console.log("Adding balance", amount.toString())
  }, [])

  /**
   * Remove balance from selected protocol
   */
  const handleRemoveBalance = React.useCallback((amount: BigNumber) => {
    if (!amount) {
      return
    }

    console.log("Removing balance", amount.toString())
  }, [])

  React.useEffect(() => {
    // Fetch protocol coverage information
    async function fetchAsyncData() {
      const protocolBalance = await getProtocolActiveBalance(selectedProtocol)
      setBalance(protocolBalance)

      const protocolCoverageleft = await getProtocolCoverageLeft(selectedProtocol)
      setCoverageLeft(protocolCoverageleft)

      const protocolPremium = await getProtocolPremium(selectedProtocol)
      setPremium(protocolPremium)
    }

    fetchAsyncData()
  }, [selectedProtocol, getProtocolActiveBalance, getProtocolCoverageLeft, getProtocolPremium])

  return (
    <div className={styles.container}>
      Protocol:
      <select value={selectedProtocol} onChange={handleOnProtocolChanged}>
        {Object.entries(COVERED_PROTOCOLS).map(([key, protocol]) => (
          <option key={key} value={key}>
            {protocol.name}
          </option>
        ))}
      </select>
      {balance && <p>Active balance: {ethers.utils.formatUnits(balance, 6)} USDC</p>}
      {coverageLeft && <p>Coverage left: {convertSecondsToDurationString(coverageLeft.toNumber())}</p>}
      <ProtocolBalanceInput
        onAdd={handleAddBalance}
        onRemove={handleRemoveBalance}
        protocolPremium={premium}
        usdcBalance={usdcBalance}
      />
    </div>
  )
}
