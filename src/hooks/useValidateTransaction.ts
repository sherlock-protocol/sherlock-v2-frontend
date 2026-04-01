import { useEffect, useState } from "react"
import config from "../config"
import { useEthersProvider } from "../utils/wagmiEthers"

type Status = {
  isValid: boolean
  isError: boolean
  isLoading: boolean
}

export const useValidateTransaction = (txHash: string) => {
  const provider = useEthersProvider(config.networkId)

  const [status, setStatus] = useState<Status>({
    isValid: false,
    isError: false,
    isLoading: false,
  })

  useEffect(() => {
    if (!txHash || txHash === "") {
      setStatus({
        isLoading: false,
        isError: false,
        isValid: false,
      })
      return
    }

    const validateTx = async () => {
      if (!provider) {
        setStatus({
          isLoading: false,
          isError: true,
          isValid: false,
        })
        return
      }

      setStatus({
        isLoading: true,
        isError: false,
        isValid: false,
      })

      try {
        const tx = await provider.getTransaction(txHash)

        setStatus({
          isLoading: false,
          isValid: !!tx,
          isError: false,
        })
      } catch (error) {
        setStatus({
          isLoading: false,
          isValid: false,
          isError: true,
        })
      }
    }

    validateTx()
  }, [txHash, provider])

  return status
}
