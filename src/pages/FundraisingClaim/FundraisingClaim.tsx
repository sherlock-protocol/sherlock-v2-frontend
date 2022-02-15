import { BigNumber, ethers } from "ethers"
import React, { useCallback, useEffect, useState } from "react"
import { useAccount } from "wagmi"

import { useSherClaimContract } from "../../hooks/useSherClaimContract"
import { useGetFundraisePositionLazyQuery } from "../../graphql/types"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Title } from "../../components/Title"
import { Text } from "../../components/Text"

import styles from "./FundraisingClaim.module.scss"
import { Button } from "../../components/Button/Button"

export const FundraisingClaimPage = () => {
  const [{ data: accountData }] = useAccount()
  const sherClaim = useSherClaimContract()
  /**
   * GraphQL query to fetch fundraise position
   */
  const [getFundraisePosition, { data: fundraisePositionData, refetch: refetchFundraisePosition }] =
    useGetFundraisePositionLazyQuery()

  /**
   * Wheter the claim is active or not.
   */
  const [claimIsActive, setClaimIsActive] = useState(false)

  /**
   * Execute GraphQL query to fetch fundraise position once the user's account is available
   */
  useEffect(() => {
    if (accountData?.address) {
      getFundraisePosition({
        variables: {
          owner: accountData.address,
        },
      })
    }
  }, [accountData?.address, getFundraisePosition])

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
      const txReceipt = await sherClaim.claim()
      console.log(txReceipt)
      refetchFundraisePosition()
    } catch (error) {
      console.log(error)
    }
  }, [sherClaim, refetchFundraisePosition])

  if (!fundraisePositionData?.fundraisePosition) return null

  const sherAmount =
    fundraisePositionData?.fundraisePosition?.reward && BigNumber.from(fundraisePositionData.fundraisePosition.reward)
  const formattedSherAmount = ethers.utils.commify(ethers.utils.formatUnits(sherAmount))

  const claimableAt = new Date(Number(fundraisePositionData.fundraisePosition.claimableAt))

  const stake = BigNumber.from(fundraisePositionData.fundraisePosition.stake)
  const contribution = BigNumber.from(fundraisePositionData.fundraisePosition.contribution)
  const participation = stake.add(contribution)

  return (
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
            <Text strong>{ethers.utils.commify(ethers.utils.formatUnits(participation, 6))} USDC</Text>
          </Column>
        </Row>
        <Row alignment="space-between">
          <Column>
            <Text>Staked</Text>
          </Column>
          <Column>
            <Text>{ethers.utils.commify(ethers.utils.formatUnits(stake, 6))}</Text>
          </Column>
        </Row>
        <Row alignment="space-between">
          <Column>
            <Text>Contributed</Text>
          </Column>
          <Column>
            <Text>{ethers.utils.commify(ethers.utils.formatUnits(contribution, 6))}</Text>
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
            <Text strong>{formattedSherAmount} tokens</Text>
          </Column>
        </Row>
        <Row className={styles.claimContainer}>
          <Column grow={1} spacing="m">
            <Row alignment="space-between" className={styles.strong}>
              <Column>
                <Text strong>Claim Status</Text>
              </Column>
              <Column>
                <Text strong>{formattedSherAmount} tokens</Text>
              </Column>
            </Row>
            <Row alignment="space-between">
              <Column>
                <Text strong>Claimable Starts</Text>
              </Column>
              <Column>
                <Text strong>{formattedSherAmount} tokens</Text>
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
  )
}
