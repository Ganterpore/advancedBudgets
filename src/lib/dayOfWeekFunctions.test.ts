import { getDaysUntilNextWeekday, numberOfOccurrencesBetween } from '$lib/dayOfWeekFunctons'
import { describe, expect, test } from 'vitest'
import { FrequencyCategory } from '$lib/types/sharedTypes'

describe('TESTING getDaysUntilNextWeekday', function () {
  describe('WHEN today is a tuesday and next weekday we are looking for is Friday or Sunday', function () {
    test('THEN getDaysUntilNextWeekday will return 3', () => {
      const res = getDaysUntilNextWeekday(2, [0, 5])
      expect(res).toEqual(3)
    })
  })
  describe('WHEN today is a Sunday and next weekday we are looking for is Thursday or Sunday', function () {
    test('THEN getDaysUntilNextWeekday will return 4', () => {
      const res = getDaysUntilNextWeekday(0, [0, 4])
      expect(res).toEqual(4)
    })
  })
  describe('WHEN today is a Friday and next weekday we are looking for is Wednesday or Friday', function () {
    test('THEN getDaysUntilNextWeekday will return 5', () => {
      const res2 = getDaysUntilNextWeekday(5, [3, 5])
      expect(res2).toEqual(5)
    })
  })
  describe('WHEN today is a Tuesday and next weekday we are looking for is Monday', function () {
    test('THEN getDaysUntilNextWeekday will return 6', () => {
      const res2 = getDaysUntilNextWeekday(2, [1])
      expect(res2).toEqual(6)
    })
  })
  describe('WHEN today is a Sunday and next weekday we are looking for is Sunday', function () {
    test('THEN getDaysUntilNextWeekday will return 7', () => {
      const res2 = getDaysUntilNextWeekday(0, [0])
      expect(res2).toEqual(7)
    })
  })
})

describe('TESTING numberOfOccurrencesSince', function () {
  describe('WHEN checking every third day between Jan 1st and  Jan 14th', function () {
    test('THEN numberOfOccurrencesSince will return 4', () => {
      const occurrences = numberOfOccurrencesBetween({
          frequency: 3,
          frequencyCategory: FrequencyCategory.DAILY,
          dayOf: 0,
        },
        new Date('01-01-2024'),
        new Date('01-14-2024')
      )
      expect(occurrences).toEqual(4)
    })
  })
  describe('WHEN checking every Tuesday and Thursday between Jan 1st 2024 (started on a monday) and Jan 14th', function () {
    test('THEN numberOfOccurrencesSince will return 4', () => {
      const occurrences = numberOfOccurrencesBetween({
          frequency: 1,
          frequencyCategory: FrequencyCategory.WEEKLY,
          dayOf: 0b0001010,
        },
        new Date('01-01-2024'),
        new Date('01-14-2024')
      )
      expect(occurrences).toEqual(4)
    })
  })
  describe('WHEN checking every second Tuesday and Thursday between Jan 1st 2024 (started on a monday) and Jan 21st', function () {
    test('THEN numberOfOccurrencesSince will return 4', () => {
      const occurrences = numberOfOccurrencesBetween({
          frequency: 2,
          frequencyCategory: FrequencyCategory.WEEKLY,
          dayOf: 0b0001010,
        },
        new Date('01-01-2024'),
        new Date('01-21-2024')
      )
      expect(occurrences).toEqual(4)
    })
  })
  describe('WHEN checking every second 15th between Jan 1st 2024 and May 31st', function () {
    test('THEN numberOfOccurrencesSince will return 3', () => {
      const occurrences = numberOfOccurrencesBetween({
          frequency: 2,
          frequencyCategory: FrequencyCategory.MONTHLY,
          dayOf: 15,
        },
        new Date('01-01-2024'),
        new Date('05-31-2024')
      )
      expect(occurrences).toEqual(3)
    })
  })
  describe('WHEN checking every second 15th between Jan 16th 2024 and May 31st', function () {
    test('THEN numberOfOccurrencesSince will return 2', () => {
      const occurrences = numberOfOccurrencesBetween({
          frequency: 2,
          frequencyCategory: FrequencyCategory.MONTHLY,
          dayOf: 15,
        },
        new Date('01-16-2024'),
        new Date('05-31-2024')
      )
      expect(occurrences).toEqual(2)
    })
  })
  describe('WHEN checking every second 15th between Jan 15th 2024 and May 31st', function () {
    test('THEN numberOfOccurrencesSince will return 2', () => {
      const occurrences = numberOfOccurrencesBetween({
          frequency: 2,
          frequencyCategory: FrequencyCategory.MONTHLY,
          dayOf: 15,
        },
        new Date('01-15-2024'),
        new Date('05-31-2024')
      )
      expect(occurrences).toEqual(2)
    })
  })
})
