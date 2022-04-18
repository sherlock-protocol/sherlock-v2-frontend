/**
 * Commify number.
 *
 * Source: https://github.com/ethers-io/ethers.js/blob/b1c7f5c21abd4e21388a25d9aa4382da9e36387b/packages/units/src.ts/index.ts#L23
 * Updated version that does not strip the ending 0 decimal.
 */
export function commify(value: string | number, fixed?: number): string {
  const comps = String(value).split(".")

  if (
    comps.length > 2 ||
    !comps[0].match(/^-?[0-9]*$/) ||
    (comps[1] && !comps[1].match(/^[0-9]*$/)) ||
    value === "." ||
    value === "-."
  ) {
    throw Error("Invalid value")
  }

  // Make sure we have at least one whole digit (0 if none)
  let whole = comps[0]

  let negative = ""
  if (whole.substring(0, 1) === "-") {
    negative = "-"
    whole = whole.substring(1)
  }

  // Make sure we have at least 1 whole digit with no leading zeros
  while (whole.substring(0, 1) === "0") {
    whole = whole.substring(1)
  }
  if (whole === "") {
    whole = "0"
  }

  let suffix = ""
  if (comps.length === 2) {
    suffix = "." + (fixed ? comps[1].slice(0, fixed) : comps[1] || "0")
  }

  const formatted = []
  while (whole.length) {
    if (whole.length <= 3) {
      formatted.unshift(whole)
      break
    } else {
      const index = whole.length - 3
      formatted.unshift(whole.substring(index))
      whole = whole.substring(0, index)
    }
  }

  return negative + formatted.join(",") + suffix
}

export function shortenNumber(num: number) {
  if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(0) + " K" // convert to K for number from > 1000 < 1 million
  } else if (num > 1000000) {
    return (num / 1000000).toFixed(1) + " M" // convert to M for number from > 1 million
  } else if (num < 900) {
    return num // if value < 1000, nothing to do
  }
}
