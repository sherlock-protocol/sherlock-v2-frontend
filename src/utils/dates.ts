import { DateTime } from "luxon"

export const formattedTimeDifference = (d: Date) => {
  const date = DateTime.fromJSDate(d)
  const diff = date.diffNow(["hours", "minutes"])
  const isPast = date < DateTime.now()

  const hourSingularOrPlural = Math.abs(diff.hours) > 0 ? "hours" : "hour"
  const hoursString = diff.hours !== 0 ? `${Math.abs(diff.hours)} ${hourSingularOrPlural}` : ""

  const minuteSingularOrPlural = Math.abs(diff.minutes) > 0 ? "minutes" : "minute"
  const minutesString = diff.hours !== 0 ? `${Math.abs(Math.floor(diff.minutes))} ${minuteSingularOrPlural}` : ""

  return `${hoursString} ${minutesString} ${isPast ? "ago" : ""}`
}
