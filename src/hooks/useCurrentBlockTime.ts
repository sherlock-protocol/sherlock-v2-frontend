import { useEffect, useState } from "react"
import { useEthersProvider } from "../utils/wagmiEthers"

export const useCurrentBlockTime = () => {
  const provider = useEthersProvider()
  const [timestamp, setTimestamp] = useState<number>()

  useEffect(() => {
    const getCurrentBlock = async () => {
      if (!provider) {
        return
      }

      const lastBlockNumber = await provider.getBlockNumber()
      const block = await provider.getBlock(lastBlockNumber)

      setTimestamp(block.timestamp)
    }

    getCurrentBlock()
  }, [provider])

  return timestamp
}
