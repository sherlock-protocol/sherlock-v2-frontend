/**
 *
 * @param hash Transaction hash
 * @returns Transaction explorer URL if using a supported chain, undefined otherwise.
 */
export const getTxUrl = (networkID: number, hash: string) => {
  switch (networkID) {
    case 1:
      // Mainnet
      return `https://etherscan.io/tx/${hash}`
    case 5:
      // Goerli
      return `https://goerli.etherscan.io/tx/${hash}`
    default:
      return undefined
  }
}

export const getAddressUrl = (networkID: number, address: string) => {
  switch (networkID) {
    case 1:
      // Mainnet
      return `https://etherscan.io/address/${address}`
    case 5:
      // Goerli
      return `https://goerli.etherscan.io/address/${address}`
    default:
      return undefined
  }
}
