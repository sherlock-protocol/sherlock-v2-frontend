import { useEffect, useState } from "react"
import { useProvider } from "wagmi"
import config from "../config"

type Status = {
  isValid: boolean
  isError: boolean
  isLoading: boolean
}

export const useValidateTransaction = (txHash: string) => {
  const provider = useProvider({ chainId: config.networkId })

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
      setStatus({
        isLoading: true,
        isError: false,
        isValid: false,
      })

      try {
        const tx = await provider.getTransaction(txHash)

        console.log(tx)

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
