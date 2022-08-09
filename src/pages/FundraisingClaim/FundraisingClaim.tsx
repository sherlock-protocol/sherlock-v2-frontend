import { ethers } from "ethers"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useAccount } from "wagmi"

import { useSherClaimContract } from "../../hooks/useSherClaimContract"
import { useFundraisePosition } from "../../hooks/api/useFundraisePosition"

import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Title } from "../../components/Title"
import { Button } from "../../components/Button/Button"
import { Text } from "../../components/Text"

import styles from "./FundraisingClaim.module.scss"

import { formattedTimeDifference } from "../../utils/dates"
import { formatAmount } from "../../utils/format"
import { useAirdropClaims, airdropClaimsQueryKey } from "../../hooks/api/useAirdropClaims"
import AirdropPosition from "../../components/AirdropPosition/AirdropPosition"
import { useWaitForBlock } from "../../hooks/api/useWaitForBlock"
import { useQueryClient } from "react-query"
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer"

export const FundraisingClaimPage = () => {
  const { address: connectedAddress } = useAccount()
  const { data } = useAirdropClaims(connectedAddress)
  const { waitForBlock } = useWaitForBlock()
  const queryClient = useQueryClient()
  const sherClaim = useSherClaimContract()

  const [isRefreshing, setIsRefreshing] = useState(false)

  /**
   * Custom hook for fetching fundraise position from Indexer API
   */

  const { getFundraisePosition, data: fundraisePositionData } = useFundraisePosition()

  /**
   * Wheter the claim is active or not.
   */
  const [claimIsActive, setClaimIsActive] = useState(false)

  /**
   * Fetch fundraise position once the user's account is available
   */
  useEffect(() => {
    if (connectedAddress) {
      getFundraisePosition(connectedAddress)
    }
  }, [connectedAddress, getFundraisePosition])

  /**
   * Fetch claim is active or not from smart contract
   */
  useEffect(() => {
    const fetchClaimIsActive = async () => {
      try {
        const isActive = await sherClaim.claimIsActive()
        setClaimIsActive(isActive)
      } catch (error) {
        console.error(error)
        setClaimIsActive(false)
      }
    }

    fetchClaimIsActive()
  })

  const handleClaim = useCallback(async () => {
    try {
      await sherClaim.claim()
      connectedAddress && getFundraisePosition(connectedAddress)
    } catch (error) {
      console.log(error)
    }
  }, [connectedAddress, sherClaim, getFundraisePosition])

  const claimStartString = useMemo(() => {
    return (
      fundraisePositionData?.claimableAt &&
      formattedTimeDifference(fundraisePositionData.claimableAt, ["days", "hours", "minutes"])
    )
  }, [fundraisePositionData?.claimableAt])

  if (!fundraisePositionData) return null

  const formattedSherAmount = formatAmount(ethers.utils.formatUnits(fundraisePositionData.reward))

  const participation = fundraisePositionData.stake.add(fundraisePositionData.contribution)

  return (
    <LoadingContainer loading={isRefreshing} label="Refreshing...">
      <Box>
        <Column spacing="m">
          <Row>
            <Title>Position</Title>
          </Row>
          <Row alignment="space-between">
            <Column>
              <Text strong>Participation</Text>
            </Column>
            <Column>
              <Text strong variant="mono">
                {formatAmount(ethers.utils.formatUnits(participation, 6))} USDC
              </Text>
            </Column>
          </Row>
          <Row alignment="space-between">
            <Column>
              <Text>Staked</Text>
            </Column>
            <Column>
              <Text variant="mono">{formatAmount(ethers.utils.formatUnits(fundraisePositionData.stake, 6))} USDC</Text>
            </Column>
          </Row>
          <Row alignment="space-between">
            <Column>
              <Text>Contributed</Text>
            </Column>
            <Column>
              <Text variant="mono">
                {formatAmount(ethers.utils.formatUnits(fundraisePositionData.contribution, 6))} USDC
              </Text>
            </Column>
          </Row>
          <Row className={styles.separator}>
            <hr />
          </Row>
          <Row alignment="space-between">
            <Column>
              <Text strong>SHER Reward</Text>
            </Column>
            <Column>
              <Text strong variant="mono">
                {formattedSherAmount} SHER
              </Text>
            </Column>
          </Row>
          <Row className={styles.claimContainer}>
            <Column grow={1} spacing="m">
              <Row alignment="space-between">
                <Column>
                  <Text strong>Claimable Starts</Text>
                </Column>
                <Column>
                  <Text strong variant="mono">
                    {claimStartString}
                  </Text>
                </Column>
              </Row>
              <Row alignment="center">
                <Button onClick={handleClaim} disabled={!claimIsActive}>
                  Claim
                </Button>
              </Row>
            </Column>
          </Row>
        </Column>
      </Box>
      {data &&
        data.map((entry) => (
          <AirdropPosition
            key={entry.id.toString()}
            index={entry.index}
            proof={entry.proof}
            tokenSymbol={entry.tokenSymbol}
            contractAddress={entry.contractAddress}
            amount={entry.amount}
            claimedAt={entry.claimedAt}
            address={entry.address}
            onSuccess={async (blockNumber: number) => {
              setIsRefreshing(true)
              await waitForBlock(blockNumber)
              await queryClient.invalidateQueries(airdropClaimsQueryKey)
              setIsRefreshing(false)
            }}
          />
        ))}
    </LoadingContainer>
  )
}
