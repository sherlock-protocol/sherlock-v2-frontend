/**
 * Escape a string to use in a regular expression
 * @param str Raw string
 * @returns Escaped string
 */
export const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Shorten a 20 bytes address, by keeping the start and the end characters,
 * and using an ellipsis in the middle.
 * @param address Address input
 * @returns Shortened address
 */
export function shortenAddress(address?: string) {
  if (!address) return null
  if (address.length < 10) return address
  return `${address.slice(0, 6)}...${address.slice(address.length - 4)}`
}
