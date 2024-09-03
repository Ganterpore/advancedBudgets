import type { PageServerLoad } from './$types'
import { getAllBudgetAccountsForUser } from '$lib/models/accountTypeBudgetModel'
import { BudgetAccountType } from '$lib/types/accountTypes'
import { getBudgetPeriodsPerYear } from '$lib/controllers/budgetController'
import type { Budget } from '$lib/types/budgetTypes'
import * as budgetModel from '$lib/models/budgetModel'

export const load: PageServerLoad = async ({ depends, locals }) => {
  const userId = Number(locals.user!.id)
  depends('data:budget')
  const budget: Budget | undefined = await budgetModel.getBudgetForUser(userId)
  depends('data:accounts')
  const budgetAccounts = await getAllBudgetAccountsForUser(userId)
  const needsBudget = budgetAccounts.filter(b => b.type ===BudgetAccountType.NEED)
    .reduce((total, budget) => total + budget.regularBudget, 0)
  const wantsBudget = budgetAccounts.filter(b => b.type ===BudgetAccountType.WANT)
    .reduce((total, budget) => total + budget.regularBudget, 0)
  return {
    needsBudget,
    wantsBudget,
    budgetPeriodsPerYear: budget ? getBudgetPeriodsPerYear(budget) : 12
  }
}
