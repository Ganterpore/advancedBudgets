import type { FrequencyCategory } from '$lib/types/sharedTypes'

export type Budget = {
  id: number,
  user: number,
  frequency: number,
  frequencyCategory: FrequencyCategory,
  dayOf: number,
  lastBudget: Date
}

export type BudgetExcess = {
  id: number,
  user: number,
  account: number,
  proportion: number
}
