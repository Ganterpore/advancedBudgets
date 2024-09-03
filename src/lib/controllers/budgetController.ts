import type { Budget } from '$lib/types/budgetTypes'
import { getNextOccurrence, numberOfOccurrencesBetween } from '$lib/dayOfWeekFunctons'

export function getBudgetPeriodsPerYear (budget: Budget) {
  const budgetStartDate = getNextOccurrence(budget, budget.lastBudget)
  const budgetEndDate = getNextOccurrence(budget, new Date(Math.max(
    budgetStartDate.getTime(),
    Date.now()
  )))
  budgetEndDate.setDate(budgetEndDate.getDate() + 1)
  const startOfYear = new Date(0)
  startOfYear.setFullYear(budget.lastBudget.getFullYear())
  const endOfYear = new Date(startOfYear)
  endOfYear.setFullYear(endOfYear.getFullYear() + 1)
  return numberOfOccurrencesBetween(budget, startOfYear, endOfYear)
}