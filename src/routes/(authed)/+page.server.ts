import type { PageServerLoad } from './$types'
import { connect } from '$lib/db'
import { getAccountsForUser } from '$lib/models/parentAccountModel'
import { getAccountTotalsForUser } from '$lib/types/transactionModel'
import { getUserById } from '$lib/models/userModel'

export const load: PageServerLoad = async ({ depends, locals }) => {
  depends('data:accounts')
  depends('data:values')
  await connect()
  const accounts = await getAccountsForUser(Number(locals.user!.id))
  const totals = await getAccountTotalsForUser(Number(locals.user!.id))
  const user = locals.user ? await getUserById(Number(locals.user.id)) : undefined
  return {
    accounts,
    totals,
    user
  }
}