import { ethers } from "ethers"
import { commify } from "ethers/lib/utils.js"
import { useCallback, useEffect, useState } from "react"
import { erc20ABI, useAccount, useBalance, useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi"
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
  const { address } = useAccount()
  const { data: profile } = useProfile()
  const { chain } = useNetwork()
  const { data: usdcBalanceData } = useBalance({
    token: config.usdcAddress(chain?.id ?? 1),
    address,
  })
  const { config: transferConfig, error: transferConfigError } = usePrepareContractWrite({
    chainId: chain?.id,
    address: config.usdcAddress(chain?.id ?? 1),
    abi: erc20ABI,
    functionName: "transfer",
    args: [config.usdcAuditorDepositsRecipient, ethers.utils.parseUnits(`${profile?.unfreezeDeposit}`, 6)],
  })
  const { writeAsync } = useContractWrite(transferConfig)
  const { submitDepositTransaction, isLoading, error, reset } = useSubmitDepositTransaction()
  const [insufficientBalance, setInsufficientBalance] = useState(false)
  const [wrongNetwork, setWrongNetwork] = useState(false)

  const handleTransfer = useCallback(async () => {
    try {
      if (writeAsync) {
        const result = await waitForTx(async () => (await writeAsync()) as ethers.ContractTransaction, {
          transactionType: TxType.GENERIC,
        })

        if (result?.blockNumber) {
          submitDepositTransaction({ transactionHash: result.transactionHash, chainId: chain?.id ?? 1 })
        }
      }
    } catch (e) {
      console.error(e)
    }
  }, [waitForTx, writeAsync, submitDepositTransaction, chain])

  const handleErrorModalClose = useCallback(() => {
    reset()
  }, [reset])

  useEffect(() => {
    setInsufficientBalance(
      !!usdcBalanceData && usdcBalanceData.value.lt(ethers.utils.parseUnits(`${profile?.unfreezeDeposit ?? 0}`, 6))
    )
  }, [setInsufficientBalance, profile, usdcBalanceData])

  useEffect(() => {
    setWrongNetwork(!!chain && !config.networks.includes(chain.id))
  }, [chain])

  if (!profile) return null

  return (
    <LoadingContainer loading={isLoading} label="Processing transaction ...">
      <Box shadow={false}>
        <Column spacing="m">
          <Title variant="h2">ACCOUNT IS FROZEN</Title>
          <Row alignment={["space-between", "center"]} spacing="s">
            <Column spacing="s">
              <Text>{`In order to unfreeze your account and being able to join audit contests, a deposit of ${commify(
                profile.unfreezeDeposit
              )} USDC is required.`}</Text>
              <Text strong variant="secondary">
                Supported networks are: Ethereum mainnet, Optimism and Arbitrum One
              </Text>
            </Column>
            <Column spacing="s">
              <Button
                variant="alternate"
                disabled={!writeAsync || !!transferConfigError || wrongNetwork}
                onClick={handleTransfer}
              >{`Transfer ${commify(profile.unfreezeDeposit)} USDC`}</Button>
              {insufficientBalance && (
                <Text variant="warning" size="small">
                  Insufficient USDC balance
                </Text>
              )}
              {wrongNetwork && (
                <Text variant="warning" size="small">
                  You're connected to the wrong network
                </Text>
              )}
            </Column>
          </Row>
        </Column>
      </Box>
      {error && <ErrorModal reason={error.message} onClose={handleErrorModalClose} />}
    </LoadingContainer>
  )
}
