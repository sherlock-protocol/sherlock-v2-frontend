import { providers } from "ethers"
import { useMemo } from "react"
import type { Address, Chain, Client, Transport } from "viem"
import { usePublicClient, useWalletClient } from "wagmi"

type ClientWithTransport = Client<Transport, Chain>

const toNetwork = (chain: Chain) => ({
  chainId: chain.id,
  name: chain.name,
  ensAddress: chain.contracts?.ensRegistry?.address as Address | undefined,
})

const publicClientToProvider = (client: ClientWithTransport) => {
  const { chain, transport } = client
  const network = toNetwork(chain)

  if (transport.type === "fallback") {
    const providersList = transport.transports.map((item) => new providers.JsonRpcProvider(item.value?.url, network))
    return new providers.FallbackProvider(providersList)
  }

  return new providers.JsonRpcProvider((transport as { url?: string }).url, network)
}

const walletClientToSigner = (client: ClientWithTransport) => {
  const { account, chain, transport } = client
  const network = toNetwork(chain)
  const provider = new providers.Web3Provider(transport, network)
  return provider.getSigner(account.address)
}

export const useEthersProvider = (chainId?: number) => {
  const publicClient = usePublicClient(chainId ? { chainId } : undefined)
  return useMemo(
    () => (publicClient ? publicClientToProvider(publicClient as ClientWithTransport) : undefined),
    [publicClient]
  )
}

export const useEthersSigner = (chainId?: number) => {
  const { data: walletClient } = useWalletClient(chainId ? { chainId } : undefined)
  return useMemo(
    () => (walletClient ? walletClientToSigner(walletClient as unknown as ClientWithTransport) : undefined),
    [walletClient]
  )
}
