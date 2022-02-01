/**
 * Escape a string to use in a regular expression
 * @param str Raw string
 * @returns Escaped string
 */
export const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
