import { useEffect, useState } from "react"
import { useProvider } from "wagmi"

export const useCurrentBlockTime = () => {
  const provider = useProvider()
  const [timestamp, setTimestamp] = useState<number>()

  useEffect(() => {
    const getCurrentBlock = async () => {
      const lastBlockNumber = await provider.getBlockNumber()
      const block = await provider.getBlock(lastBlockNumber)

      setTimestamp(block.timestamp)
    }

    getCurrentBlock()
  }, [provider])

  return timestamp
}
