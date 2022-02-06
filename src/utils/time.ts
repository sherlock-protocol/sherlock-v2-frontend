/**
 * Convert number of seconds into a human-readable duration string.
 *
 * E.g. 3600 seconds -> 0 days, 1 hour
 * @param seconds Number of seconds to convert
 */
export const convertSecondsToDurationString = (seconds: number): string => {
  if (!seconds || seconds < 0) {
    return ""
  }

  // Compute number of days
  const days = Math.floor(seconds / (60 * 60 * 24))

  // Compute number of days in seconds
  const daysInSeconds = days * 60 * 60 * 24

  // Compute number of hours remaining
  // by substracting the number of days in seconds
  const hours = Math.floor((seconds - daysInSeconds) / (60 * 60))

  return `${days} days, ${hours} ${hours === 1 ? "hour" : "hours"}`
}
