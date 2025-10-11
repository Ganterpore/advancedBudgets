import type { Budget } from '$lib/types/budgetTypes'
import { getAllBudgetAccountsForUser } from '$lib/models/accountTypeBudgetModel'
import { BudgetAccountType } from '$lib/types/accountTypes'
import type { Investment } from '$lib/types/accountTypes'
import {
  getBudgetedAmountOverPeriod,
  getBudgetPeriodsPerYear,
} from '$lib/controllers/budgetController'
import { getAllBudgetSavingsAccounts } from '$lib/models/budgetSavingsModel'

export async function getAverageBudget (userId: number, budget: Budget): Promise<{ needsBudget: number, wantsBudget: number }> {
  const budgetPeriodsPerYear = getBudgetPeriodsPerYear(budget)
  const now = new Date()
  const inOneYear = new Date()
  inOneYear.setFullYear(inOneYear.getFullYear() + 1)

  const budgetAccounts = await getAllBudgetAccountsForUser(userId)
  const yearlyNeedsBudget = budgetAccounts.filter(b => b.type === BudgetAccountType.NEED)
    .reduce((total, budgetAccount) => {
      return total + getBudgetedAmountOverPeriod(budgetAccount, now, inOneYear)
    }, 0)
  const yearlyWantsBudget = budgetAccounts.filter(b => b.type === BudgetAccountType.WANT)
    .reduce((total, budgetAccount) => {
      return total + getBudgetedAmountOverPeriod(budgetAccount, now, inOneYear)
    }, 0)

  const needsBudget = yearlyNeedsBudget / budgetPeriodsPerYear
  const wantsBudget = yearlyWantsBudget / budgetPeriodsPerYear
  return { needsBudget, wantsBudget }
}

export function getCurrentCapital (investments: Investment[]) {
  return investments.reduce((total, investment) => total + investment.amount, 0)
}

export async function getBudgetedAmountToCapital (userId: number) {
  const budgetSavingsAccounts = await getAllBudgetSavingsAccounts(userId)
  return budgetSavingsAccounts.reduce((total, budget) => {
    if (budget.type !== 'investment') return total
    return total + budget.max
  }, 0)
}