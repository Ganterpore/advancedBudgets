import { arrayToString, getOrdinalNum } from '$lib/utils'
import { FrequencyCategory } from '$lib/types/sharedTypes'

type DayOfWeek = { id: number, name: string, fullName: string, index: number }
export const daysOfWeek: DayOfWeek[] = [
  { id: 0b0000001, name: 'Mon', fullName: 'Monday', index: 1 },
  { id: 0b0000010, name: 'Tue', fullName: 'Tuesday', index: 2 },
  { id: 0b0000100, name: 'Wed', fullName: 'Wednesday', index: 3 },
  { id: 0b0001000, name: 'Thu', fullName: 'Thursday', index: 4 },
  { id: 0b0010000, name: 'Fri', fullName: 'Friday', index: 5 },
  { id: 0b0100000, name: 'Sat', fullName: 'Saturday', index: 6 },
  { id: 0b1000000, name: 'Sun', fullName: 'Sunday', index: 0 }
];

export const isDayBitActive = (value: number, day: number) => (value & day) === day
export const dayBitMapToArray  = (dayBitmap: number) => {
  const days: DayOfWeek[] = []
  for (const day of daysOfWeek) {
    if (isDayBitActive(dayBitmap, day.id)) days.push(day)
  }
  return days
}
export const dayBitMapToString = (dayBitmap: number) => {
  return arrayToString(dayBitMapToArray(dayBitmap).map(d => d.fullName))
}

export type FrequencyObject = {
  frequency: number,
  frequencyCategory: FrequencyCategory,
  dayOf: number
}

export const frequencyDetailsToString = (frequencyObj: FrequencyObject) => {
  const { frequency, frequencyCategory, dayOf } = frequencyObj
  let string = ''
  string += `Every ${frequency > 1 ? frequency + ' ' : ''}
                  ${frequencyCategory}${frequency > 1 ? 's' + ' ' : ''}`
  if (frequencyCategory === FrequencyCategory.DAILY) return string
  string += `${dayOf > 0 ? ' on the ' : ''}
                ${frequencyCategory === FrequencyCategory.WEEKLY
    ? dayBitMapToString(dayOf)
    : dayOf + getOrdinalNum(dayOf)}.`
  return string
}

export function getDaysUntilNextWeekday (day: number, days: number[]) {
  let daysUntil = 0
  let upcomingDays = days.filter(d => d > day)
  if (upcomingDays.length === 0) {
    // no upcoming days this week
    daysUntil = 7 - day
    day = 0
    upcomingDays = days
  }
  const curr = upcomingDays[0]
  while (curr != day) {
    day += 1
    daysUntil += 1
  }
  return daysUntil
}

export const getNextOccurrence = (frequencyObj: FrequencyObject, after: Date) => {
  const { frequency, frequencyCategory, dayOf } = frequencyObj
  const nextDate = new Date(after)
  if (frequencyCategory === FrequencyCategory.DAILY) {
    nextDate.setDate(nextDate.getDate() + frequency)
  } else if (frequencyCategory === FrequencyCategory.WEEKLY) {
    const validWeekdays = dayBitMapToArray(dayOf).map(d => d.index).sort()
    const daysUntilNext = getDaysUntilNextWeekday(nextDate.getDay(), validWeekdays)
    const goesOverWeek = (nextDate.getDay() + daysUntilNext) >= 7
    const daysToAdd = daysUntilNext + (goesOverWeek ? 7 * (frequency - 1) : 0)
    nextDate.setDate(nextDate.getDate() + daysToAdd)
  } else if (frequencyCategory === FrequencyCategory.MONTHLY) {
    // If the day has already passed, go to the next budgeted month
    if (nextDate.getDate() >= dayOf) {
      nextDate.setMonth(nextDate.getMonth() + frequency)
    }
    nextDate.setDate(dayOf)
  }
  return nextDate
}

export const numberOfOccurrencesBetween = (frequencyObj: FrequencyObject, sinceDate: Date, untilDate: Date) => {
  let currentDate = new Date(sinceDate)
  let occurrences = 0
  currentDate = getNextOccurrence(frequencyObj, currentDate)
  while (currentDate < untilDate) {
    occurrences += 1
    currentDate = getNextOccurrence(frequencyObj, currentDate)
  }
  return occurrences
}
