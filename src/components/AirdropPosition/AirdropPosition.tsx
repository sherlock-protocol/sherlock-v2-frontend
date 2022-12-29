import { ethers, BigNumber } from "ethers"
import { DateTime } from "luxon"
import React from "react"
import MerkleDistributorABI from "../../abi/MerkleDistributor"
import { Box } from "../Box"
import { Button } from "../Button"
import { Column, Row } from "../Layout"
import { Text } from "../Text"
import { Title } from "../Title"
import styles from "./AirdropPosition.module.scss"
import { useContract, useProvider, useSigner, Address } from "wagmi"
import useWaitTx from "../../hooks/useWaitTx"
import { formatAmount } from "../../utils/format"

type Props = {
  index: number
  proof: `0x${string}`[]
  contractAddress: string
  amount: BigNumber
  claimedAt: DateTime | null
  tokenSymbol: string
  address: Address
  onSuccess?: (blockNumber: number) => void
}

const AirdropPosition: React.FC<Props> = ({
  tokenSymbol,
  amount,
  claimedAt,
  contractAddress,
  address,
  proof,
  index,
  onSuccess,
}) => {
  const { data: signerData } = useSigner()
  const provider = useProvider()
  const contract = useContract({
    address: contractAddress,
    signerOrProvider: signerData || provider,
    abi: MerkleDistributorABI,
  })
  const { waitForTx } = useWaitTx()

  const units = React.useMemo(() => (tokenSymbol === "USDC" ? 6 : 18), [tokenSymbol])

  /**
   * Claim the position
   */
  const handleOnClaim = React.useCallback(async () => {
    if (!!claimedAt) {
      return
    }

    try {
      const result = await waitForTx(async () => await contract?.claim(BigNumber.from(index), address, amount, proof))
      result?.blockNumber && onSuccess?.(result.blockNumber)
    } catch (e) {
      return false
    }

    return true
  }, [amount, claimedAt, address, contract, proof, waitForTx, index, onSuccess])

  return (
    <Box className={styles.container}>
      <Column spacing="m">
        <Row>
          <Title>{tokenSymbol} Position</Title>
        </Row>
        <Row alignment="space-between">
          <Column>
            <Text>You are eligible to claim</Text>
          </Column>
          <Column>
            <Text strong variant="mono">
              {formatAmount(ethers.utils.formatUnits(amount, units))} {tokenSymbol}
            </Text>
          </Column>
        </Row>
        <Row className={claimedAt ? styles.claimContainer : undefined}>
          <Column grow={1} spacing="m">
            {claimedAt && (
              <Row alignment="space-between">
                <Column>
                  <Text strong>Claimed at</Text>
                </Column>
                <Column>
                  <Text strong variant="mono">
                    {claimedAt.toLocaleString(DateTime.DATETIME_MED)}
                  </Text>
                </Column>
              </Row>
            )}
            <Row alignment="center">
              <Button onClick={handleOnClaim} disabled={!!claimedAt}>
                Claim
              </Button>
            </Row>
          </Column>
        </Row>
      </Column>
    </Box>
  )
}

export default AirdropPosition
