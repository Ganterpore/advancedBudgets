import type { RequestHandler } from './$types'
import type { BudgetSavings } from '$lib/types/budgetTypes'
import {
  deleteBudgetSavingsAccount,
  newBudgetSavingsAccount,
  updateBudgetSavingsAccount
} from '$lib/models/budgetSavingsModel'

export const POST: RequestHandler = async ({ request, locals }) => {
  const budgetSavings: Omit<BudgetSavings, 'id'> & Partial<BudgetSavings> = await request.json()
  budgetSavings.user = Number(locals.user!.id)
  if (budgetSavings.id) {
    await updateBudgetSavingsAccount(budgetSavings as BudgetSavings)
  } else {
    await newBudgetSavingsAccount(budgetSavings)
  }
  return new Response
}

export const DELETE: RequestHandler = async ({ request, locals }) => {
  const { id } = await request.json()
  const userId = Number(locals.user!.id)
  await deleteBudgetSavingsAccount(Number(id), userId)
  return new Response
}
