import type { RequestHandler } from './$types'
import type { Budget } from '$lib/types/budgetTypes'
import { updateBudget } from '$lib/models/budgetModel'

export const POST: RequestHandler = async ({ request, locals }) => {
  const budget: Budget = await request.json()
  budget.user = Number(locals.user!.id)
  await updateBudget(budget)
  return new Response
}