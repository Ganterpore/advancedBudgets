import {arrayToString} from "$lib/utils";

export const daysOfWeek = [
    { id: 0b0000001, name: 'Mon', fullName: 'Monday' },
    { id: 0b0000010, name: 'Tue', fullName: 'Tuesday' },
    { id: 0b0000100, name: 'Wed', fullName: 'Wednesday' },
    { id: 0b0001000, name: 'Thu', fullName: 'Thursday' },
    { id: 0b0010000, name: 'Fri', fullName: 'Friday' },
    { id: 0b0100000, name: 'Sat', fullName: 'Saturday' },
    { id: 0b1000000, name: 'Sun', fullName: 'Sunday' }
];

export const isDayBitActive = (value: number, day: number) => (value & day) === day
export const dayBitMapToString = (dayBitmap: number) => {
    const days: string[] = []
    for (const day of daysOfWeek) {
        if (isDayBitActive(dayBitmap, day.id)) days.push(day.fullName)
    }
    return arrayToString(days)
}
