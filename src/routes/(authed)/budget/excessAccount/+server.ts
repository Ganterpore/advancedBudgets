import type { RequestHandler } from './$types'
import type { BudgetExcess } from '$lib/types/budgetTypes'
import { deleteExcessAccount, newExcessAccount, updateExcessAccount } from '$lib/models/budgetExcessModel'

export const POST: RequestHandler = async ({ request, locals }) => {
  const excess: Omit<BudgetExcess, 'id'> & Partial<BudgetExcess> = await request.json()
  excess.user = Number(locals.user!.id)
  if (excess.id) {
    await updateExcessAccount(excess as BudgetExcess)
  } else {
    await newExcessAccount(excess)
  }
  return new Response
}

export const DELETE: RequestHandler = async ({ request, locals }) => {
  const { id } = await request.json()
  const userId = Number(locals.user!.id)
  await deleteExcessAccount(Number(id), userId)
  return new Response
}
