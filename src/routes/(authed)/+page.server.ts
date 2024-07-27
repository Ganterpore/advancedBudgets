import type { PageServerLoad } from './$types'
import { getAccountTotalsForUser } from '$lib/types/transactionModel'
import { getUserById } from '$lib/models/userModel'

export const load: PageServerLoad = async ({ depends, locals }) => {
  depends('data:values')
  const totals = await getAccountTotalsForUser(Number(locals.user!.id))
  const user = locals.user ? await getUserById(Number(locals.user.id)) : undefined
  return {
    totals,
    user
  }
}