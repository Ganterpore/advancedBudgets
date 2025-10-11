import type { PageServerLoad } from './$types'
import { getBudgetPeriodsPerYear, } from '$lib/controllers/budgetController'
import type { Budget } from '$lib/types/budgetTypes'
import * as budgetModel from '$lib/models/budgetModel'
import { error } from '@sveltejs/kit'
import { getAverageBudget, getBudgetedAmountToCapital, getCurrentCapital } from '$lib/controllers/retirementController'

export const load: PageServerLoad = async ({ depends, locals, parent }) => {
  const layout = await parent()
  const userId = Number(locals.user!.id)
  depends('data:budget')
  const budget: Budget | undefined = await budgetModel.getBudgetForUser(userId)
  if (!budget) error(400, { message: 'You must create a budget before beginning retirement planning' })

  depends('data:accounts')
  const { needsBudget, wantsBudget } = await getAverageBudget(userId, budget)

  depends('data:budgetSavings')
  const currentCapital = getCurrentCapital(layout.investments)
  const budgetedAmountToCapital = await getBudgetedAmountToCapital(userId)

  return {
    needsBudget,
    wantsBudget,
    currentCapital,
    budgetedAmountToCapital,
    budgetPeriodsPerYear: budget ? getBudgetPeriodsPerYear(budget) : 12
  }
}
