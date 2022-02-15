const networkId = parseInt(`${process.env.REACT_APP_NETWORK_ID}`)

/**
 *
 * @param hash Transaction hash
 * @returns Transaction explorer URL if using a supported chain, undefined otherwise.
 */
export const getTxUrl = (hash: string) => {
  switch (networkId) {
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