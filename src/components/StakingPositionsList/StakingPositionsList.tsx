import React, { useEffect, useMemo } from "react"
import { useAccount } from "wagmi"

import StakingPositionItem from "../StakingPosition/StakingPosition"

import { StakingPosition, useStakingPositions } from "../../hooks/api/useStakingPositions"

import styles from "./StakingPositionsList.module.scss"
import { BigNumber } from "ethers"
import { Title } from "../Title"
import { Column, Row } from "../Layout"
import { Button } from "../Button/Button"
import { useLocation, useNavigate } from "react-router-dom"
import useInterval from "../../hooks/useInterval"
import { useWaitForBlock } from "../../hooks/api/useWaitForBlock"
import LoadingContainer from "../LoadingContainer/LoadingContainer"
import { Text } from "../Text"

type LocationState = {
  refreshAfterBlockNumber?: number
}

export const StakingPositionsList: React.FC = () => {
  const { address: connectedAddress } = useAccount()
  const { getStakingPositions, data, loading } = useStakingPositions()
  const [positions, setPositions] = React.useState<Array<StakingPosition>>([])
  const navigate = useNavigate()
  const { state } = useLocation()
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const { waitForBlock } = useWaitForBlock()

  /**
   * Setup USDC real-time update
   */
  const handleSetupUSDCUpdate = React.useCallback(() => {
    if (!data?.positions || !data?.usdcLastUpdated) {
      return
    }

    // Initialize scaled USDC balance, to be used for
    // real-time balance updates.
    // Also, compensate for the gap between now and
    // indexer's last update time.
    const diff = Math.floor((new Date().valueOf() - data?.usdcLastUpdated.valueOf()) / 1000)
    const updatedPositions = data?.positions?.map((item) => {
      const delta = BigNumber.from(item?.scaledUsdcIncrement ?? 0).mul(diff)
      const scaledUsdc = item.usdc.mul(1e6).add(delta)

      return {
        ...item,
        scaledUsdc,
        usdc: scaledUsdc.div(1e6),
      }
    })

    setPositions(updatedPositions)
  }, [data?.positions, data?.usdcLastUpdated])

  /**
   * Trigger recomputing of accrued USDC balance on an interval.
   */
  useInterval(() => {
    setPositions(
      positions.map((item) => {
        const oldBalance = item.scaledUsdc
        const newBalanceScaled = oldBalance?.add(item.scaledUsdcIncrement ?? 0)
        const newBalance = newBalanceScaled?.div(1e6) as BigNumber

        return {
          ...item,
          usdc: newBalance,
          scaledUsdc: newBalanceScaled,
        }
      })
    )
  }, 1000)

  /**
   * Fetch staking positions from indexer API
   */
  const fetchStakingPositions = React.useCallback(async () => {
    if (connectedAddress) {
      await getStakingPositions(connectedAddress)
    }
  }, [connectedAddress, getStakingPositions])

  /**
   * Refresh staking positions list after indexer is up to date
   * with a specific block.
   */
  const refreshStakingPositionsAfterBlock = React.useCallback(
    async (blockNumber: number) => {
      if (!blockNumber) {
        return
      }

      setIsRefreshing(true)

      // Wait for the indexer to be indexer up to `blockNumber`
      await waitForBlock(blockNumber)

      // Refresh staking
      await fetchStakingPositions()

      setIsRefreshing(false)
    },
    [fetchStakingPositions, waitForBlock]
  )

  /**
   * Refresh staking positions on account updates
   */
  useEffect(() => {
    fetchStakingPositions()
  }, [connectedAddress, fetchStakingPositions])

  /**
   * Setup USDC increments after each staking positions refresh
   */
  useEffect(() => {
    handleSetupUSDCUpdate()
  }, [data?.positions, handleSetupUSDCUpdate])

  /**
   * If `refreshAfterBlockNumber` navigation param was sent,
   * refresh the staking positions list after the block has been indexed.
   */
  useEffect(() => {
    const { refreshAfterBlockNumber } = (state as LocationState) ?? {}
    if (refreshAfterBlockNumber) {
      refreshStakingPositionsAfterBlock(refreshAfterBlockNumber)
    }
  }, [state, refreshStakingPositionsAfterBlock])

  const handleGoToStaking = React.useCallback(() => {
    navigate("/")
  }, [navigate])

  const mapleAlertVisible = useMemo(() => positions?.some((item) => item.id <= 442), [positions])

  if (!data) return null

  return (
    <LoadingContainer loading={isRefreshing} label="Refreshing...">
      {mapleAlertVisible && (
        <Row alignment="center" className={styles.alert}>
          <Column spacing="m">
            <Title>Logistical update on the Maple situation</Title>
            <Text>
              Due to the suboptimal design of Maple V1, Maple is migrating the Maven 11 pool to Maple V2. Because of
              this, the Maple V1 strategy will need to be force-removed from Sherlock's yield strategy contracts so that
              Sherlock can accommodate Maple's migration to their V2 contracts. All funds that are recovered from Maple
              by Sherlock (still estimated to be ~1M USDC) will need to be airdropped to affected Sherlock stakers.
              Normally, the recovered funds would be part of the funds released when a staker unstakes, but because of
              this situation, Sherlock will need to airdrop them separately.
            </Text>
            <Text>
              The force-remove action will be taken on Tuesday, December 20th and the staking pool will appear to
              decrease by 5M USDC at that time. Again, the estimated 1M USDC that Maven 11 expects to return to Sherlock
              will be airdropped to affected stakers when those funds become available (still waiting on borrower
              repayments in the Maple pool).
            </Text>
          </Column>
        </Row>
      )}
      <div className={styles.container}>
        {positions.map((position) => (
          <StakingPositionItem
            key={position.id.toString()}
            id={BigNumber.from(position.id)}
            usdcBalance={position.usdc}
            sherRewards={position.sher}
            lockupEnd={position.lockupEnd}
            apy={position?.usdcAPY ?? data?.usdcAPY}
            onUpdate={refreshStakingPositionsAfterBlock}
            restakeCount={position.restakeCount}
          />
        ))}
        {!loading && data?.positions?.length === 0 && (
          <Column spacing="m">
            <Title>No active positions found.</Title>
            <Button onClick={handleGoToStaking}>Go to Staking</Button>
          </Column>
        )}
      </div>
    </LoadingContainer>
  )
}
