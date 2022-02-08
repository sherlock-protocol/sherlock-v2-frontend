import { BigNumber, ethers } from "ethers"
import React, { useCallback, useEffect, useState } from "react"
import { useAccount } from "wagmi"

import { useSherClaimContract } from "../../hooks/useSherClaimContract"
import { useGetFundraisePositionLazyQuery } from "../../graphql/types"

export const FundraisingClaimPage = () => {
  const [{ data: accountData }] = useAccount()
  const sherClaim = useSherClaimContract()
  /**
   * GraphQL query to fetch fundraise position
   */
  const [getFundraisePotision, { data: fundraisePositionData, refetch: refetchFundraisePosition }] =
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
      getFundraisePotision({
        variables: {
          owner: accountData.address,
        },
      })
    }
  }, [accountData?.address, getFundraisePotision])

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
    <div>
      <h1>CLAIM</h1>
      <h2>Participation: {ethers.utils.commify(ethers.utils.formatUnits(participation, 6))}</h2>
      <h2>Stake: {ethers.utils.commify(ethers.utils.formatUnits(stake, 6))}</h2>
      <h2>Contributed: {ethers.utils.commify(ethers.utils.formatUnits(contribution, 6))}</h2>
      <h2>Reward: {formattedSherAmount} SHER</h2>
      <h2>Claimable starts: {claimableAt.toDateString()}</h2>
      <button onClick={handleClaim} disabled={!claimIsActive}>
        {claimIsActive ? `Claim ${formattedSherAmount} SHER` : "Claim is not active yet"}
      </button>
    </div>
  )
}
