import { ethers } from "ethers"
import { commify } from "ethers/lib/utils.js"
import { useCallback } from "react"
import { erc20ABI, useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi"
import { Box } from "../../../components/Box"
import { Button } from "../../../components/Button"
import { CopyAddress } from "../../../components/CopyAddress/CopyAddress"
import { Row, Column } from "../../../components/Layout"
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer"
import { Text } from "../../../components/Text"
import { Title } from "../../../components/Title"
import config from "../../../config"
import { useProfile } from "../../../hooks/api/auditors/useProfile"
import { useSubmitDepositTransaction } from "../../../hooks/api/auditors/useSubmitDepositTransaction"
import useWaitTx from "../../../hooks/useWaitTx"
import { TxType } from "../../../utils/txModalMessages"
import { ErrorModal } from "../../ContestDetails/ErrorModal"

export const AccountFrozenBanner = () => {
  const { waitForTx } = useWaitTx()
  const { data: profile } = useProfile()
  const { chain } = useNetwork()
  const { config: transferConfig } = usePrepareContractWrite({
    chainId: chain?.id,
    address: config.usdcAddress(chain?.id ?? 1),
    abi: erc20ABI,
    functionName: "transfer",
    args: [config.usdcAuditorDepositsRecipient, ethers.utils.parseUnits(`${profile?.unfreezeDeposit}`, 6)],
  })
  const { writeAsync } = useContractWrite(transferConfig)

  const { submitDepositTransaction, isLoading, error, reset } = useSubmitDepositTransaction()

  const handleTransfer = useCallback(async () => {
    try {
      if (writeAsync) {
        const result = await waitForTx(async () => (await writeAsync()) as ethers.ContractTransaction, {
          transactionType: TxType.GENERIC,
        })

        if (result?.blockNumber) {
          submitDepositTransaction({ transactionHash: result.transactionHash })
        }
      }
    } catch (e) {
      console.error(e)
    }
  }, [waitForTx, writeAsync, submitDepositTransaction])

  const handleErrorModalClose = useCallback(() => {
    reset()
  }, [reset])

  if (!profile) return null

  return (
    <LoadingContainer loading={isLoading} label="Processing transaction ...">
      <Box shadow={false}>
        <Row alignment="space-between">
          <Column spacing="m" alignment={["start", "center"]}>
            <Title variant="h2">ACCOUNT IS FROZEN</Title>
            <Text>{`In order to unfreeze your account and being able to join audit contests, a deposit of ${commify(
              profile.unfreezeDeposit
            )} USDC is required.`}</Text>
            <Text variant="secondary">{`Please, send ${commify(
              profile.unfreezeDeposit
            )} USDC to the address below, or click the button on the right.`}</Text>
            <Row spacing="m">
              <Column grow={0}>
                <CopyAddress address={config.usdcAuditorDepositsRecipient} />
              </Column>
              <Button variant="alternate" disabled={!writeAsync} onClick={handleTransfer}>{`Transfer ${commify(
                profile.unfreezeDeposit
              )} USDC`}</Button>
            </Row>
            <Text strong variant="secondary">
              Supported networks are: Ethereum mainnet, Optimism and Arbitrum One
            </Text>
          </Column>
        </Row>
      </Box>
      {error && <ErrorModal reason={error.message} onClose={handleErrorModalClose} />}
    </LoadingContainer>
  )
}
