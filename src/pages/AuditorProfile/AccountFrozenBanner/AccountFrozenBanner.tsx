import { ethers } from "ethers"
import { commify } from "ethers/lib/utils.js"
import { useCallback } from "react"
import { erc20ABI, useContractWrite, usePrepareContractWrite } from "wagmi"
import { Box } from "../../../components/Box"
import { Button } from "../../../components/Button"
import { Row, Column } from "../../../components/Layout"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import config from "../../../config"
import { useProfile } from "../../../hooks/api/auditors/useProfile"
import useWaitTx from "../../../hooks/useWaitTx"
import { TxType } from "../../../utils/txModalMessages"

export const AccountFrozenBanner = () => {
  const { waitForTx } = useWaitTx()
  const { data: profile } = useProfile()
  const { config: transferConfig } = usePrepareContractWrite({
    address: config.usdcAddress,
    abi: erc20ABI,
    functionName: "transfer",
    args: [config.usdcRecipient, ethers.utils.parseUnits(`${profile?.unfreezeDeposit}`, 6)],
  })
  const { writeAsync } = useContractWrite(transferConfig)

  const handleTransfer = useCallback(async () => {
    try {
      if (writeAsync) {
        const result = await waitForTx(async () => (await writeAsync()) as ethers.ContractTransaction, {
          transactionType: TxType.GENERIC,
        })
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  if (!profile) return null

  return (
    <Box shadow={false}>
      <Row alignment="space-between">
        <Column spacing="m" alignment={["start", "center"]}>
          <Title variant="h2">ACCOUNT IS FROZEN</Title>
          <Text>{`In order to join audit contests, a deposit of ${commify(
            profile.unfreezeDeposit
          )} USDC is required to unfreeze your account.`}</Text>
          <Text variant="secondary">You can make the transfer on Ethereum Mainnet, Optimism or Arbitrum.</Text>
        </Column>
        <Button variant="alternate" disabled={!writeAsync} onClick={handleTransfer}>{`Transfer ${commify(
          profile.unfreezeDeposit
        )} USDC`}</Button>
      </Row>
    </Box>
  )
}
