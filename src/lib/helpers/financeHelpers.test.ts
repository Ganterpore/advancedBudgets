import { describe, test, expect } from 'vitest'
import { compoundedValue } from './financeHelpers'

describe('TESTING compoundedValue', () => {
  describe('WHEN there is a $10,000 principle with a 5% compound rate with regular $200 deposits left for 10 years', () => {
    test('THEN it will have the value of $47,527', () => {
      const res = compoundedValue(10000, 200, 5, 12, 10)
      expect(res).toEqual(47527)
    })
  })
  describe('WHEN there is a $10,000 principle with a 5% compound rate with no deposits left for 10 years', () => {
    test('THEN it will have the value of $16,470', () => {
      const res = compoundedValue(10000, 0, 5, 12, 10)
      expect(res).toEqual(16470)
    })
  })
  describe('WHEN there is a $10,000 principle with a 10% compound rate with regular $200 deposits left for 10 years', () => {
    test('THEN it will have the value of $68,039', () => {
      const res = compoundedValue(10000, 200, 10, 12, 10)
      expect(res).toEqual(68039)
    })
  })
  describe('WHEN there is a $20,000 principle with a 5% compound rate with regular $200 deposits left for 10 years', () => {
    test('THEN it will have the value of $63,997', () => {
      const res = compoundedValue(20000, 200, 5, 12, 10)
      expect(res).toEqual(63997)
    })
  })
  describe('WHEN there is a $10,000 principle with a 5% compound rate with regular $200 deposits left for 20 years', () => {
    test('THEN it will have the value of $109,333', () => {
      const res = compoundedValue(10000, 200, 5, 12, 20)
      expect(res).toEqual(109333)
    })
  })
  describe('WHEN there is a $10,000 principle with a 5% compound rate with regular $200 deposits left for 10 years, compounding yearly', () => {
    test('THEN it will have the value of $18,805', () => {
      const res = compoundedValue(10000, 200, 5, 1, 10)
      expect(res).toEqual(18805)
    })
  })
})