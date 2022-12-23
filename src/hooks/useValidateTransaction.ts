import { useEffect, useState } from "react"
import { useProvider } from "wagmi"

type Status = {
  isValid: boolean
  isError: boolean
  isLoading: boolean
}

export const useValidateTransaction = (txHash: string) => {
  const provider = useProvider()

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
