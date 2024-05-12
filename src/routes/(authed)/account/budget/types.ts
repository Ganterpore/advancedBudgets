import { FrequencyCategory } from "$lib/types";

export type AccountTypeBudget = {
  id: number
  account: number
  regularBudget: number
  budgetMax: number
  frequency: number
  frequencyCategory: FrequencyCategory
  startDate: Date
  dayOf: number
}