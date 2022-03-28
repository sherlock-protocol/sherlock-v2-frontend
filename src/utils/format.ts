import { commify } from "./units"

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

/**
 * Format an amount, with a set number of decimals
 * @param amount Amount as string or number
 * @returns Amount as string, with fixed number of decimals
 */
export const formatAmount = (amount: number | string, decimals: number = 2) => {
  return commify((+amount).toFixed(decimals))
}
