import type { PageServerLoad } from './$types'
import { getAllBudgetAccountsForUser } from '$lib/models/accountTypeBudgetModel'
import { BudgetAccountType } from '$lib/types/accountTypes'
import {
  getBudgetedAmountOverPeriod,
  getBudgetPeriodsPerYear,
  getCurrentBudgetPeriod
} from '$lib/controllers/budgetController'
import type { Budget } from '$lib/types/budgetTypes'
import * as budgetModel from '$lib/models/budgetModel'
import { getAllBudgetSavingsAccounts } from '$lib/models/budgetSavingsModel'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ depends, locals, parent }) => {
  const layout = await parent()
  const userId = Number(locals.user!.id)
  depends('data:budget')
  const budget: Budget | undefined = await budgetModel.getBudgetForUser(userId)
  if (!budget) error(400, { message: 'You must create a budget before beginning retirement planning' })
  const [budgetStartDate, budgetEndDate] = getCurrentBudgetPeriod(budget)

  depends('data:accounts')
  const budgetAccounts = await getAllBudgetAccountsForUser(userId)
  const needsBudget = budgetAccounts.filter(b => b.type === BudgetAccountType.NEED)
    .reduce((total, budgetAccount) => total + getBudgetedAmountOverPeriod(budgetAccount, budgetStartDate, budgetEndDate), 0)
  const wantsBudget = budgetAccounts.filter(b => b.type === BudgetAccountType.WANT)
    .reduce((total, budgetAccount) => total + getBudgetedAmountOverPeriod(budgetAccount, budgetStartDate, budgetEndDate), 0)

  depends('data:budgetSavings')
  const { investments } = layout
  const currentCapital = investments.reduce((total, investment) => total + investment.amount, 0)
  const budgetSavingsAccounts = await getAllBudgetSavingsAccounts(userId)
  const budgetedAmountToCapital = budgetSavingsAccounts.reduce((total, budget) => {
    if (budget.type !== 'investment') return total
    return total + budget.max
  }, 0)

  return {
    needsBudget,
    wantsBudget,
    currentCapital,
    budgetedAmountToCapital,
    budgetPeriodsPerYear: budget ? getBudgetPeriodsPerYear(budget) : 12
  }
}
