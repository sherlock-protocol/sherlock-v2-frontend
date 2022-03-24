/**
 * Commify number.
 *
 * Source: https://github.com/ethers-io/ethers.js/blob/b1c7f5c21abd4e21388a25d9aa4382da9e36387b/packages/units/src.ts/index.ts#L23
 * Updated version that does not strip the ending 0 decimal.
 */
export function commify(value: string | number): string {
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
    suffix = "." + (comps[1] || "0")
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