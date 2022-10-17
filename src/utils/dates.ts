import { DateTime, Duration } from "luxon"

type TimeUnit = "days" | "hours" | "minutes"

export const formattedTimeDifference = (d: Date, units: TimeUnit[] = ["hours", "minutes"]) => {
  const date = DateTime.fromJSDate(d)
  const diff = date.diffNow(units)
  const isPast = date < DateTime.now()

  const daySingularOrPlural = Math.abs(diff.days) > 0 ? "days" : "day"
  const daysString = diff.days !== 0 ? `${Math.abs(diff.days)} ${daySingularOrPlural} ` : ""

  const hourSingularOrPlural = Math.abs(diff.hours) > 0 ? "hours" : "hour"
  const hoursString = diff.hours !== 0 ? `${Math.abs(diff.hours)} ${hourSingularOrPlural} ` : ""

  const minuteSingularOrPlural = Math.abs(Math.floor(diff.minutes)) > 0 ? "minutes" : "minute"
  const minutesString = diff.minutes !== 0 ? `${Math.abs(Math.floor(diff.minutes))} ${minuteSingularOrPlural}` : ""

  return `${daysString}${hoursString}${minutesString} ${isPast ? "ago" : ""}`
}

export const timeLeftString = (timeLeft: Duration) => {
  const timeArray = []

  if (timeLeft.days > 0) timeArray.push(`${timeLeft.days} day${timeLeft.days > 1 ? "s" : ""}`)
  if (timeLeft.hours > 0) timeArray.push(`${timeLeft.hours} hour${timeLeft.hours > 1 ? "s" : ""}`)
  if (timeLeft.minutes > 0) timeArray.push(`${timeLeft.minutes} minute${timeLeft.minutes > 1 ? "s" : ""}`)

  // We just want to display 2 units
  return timeArray.length > 0 ? timeArray.slice(0, 2).join(" ") : "< 1 min"
}
