import type { PageServerLoad } from './$types'
import { connect } from '$lib/db'
import { getAccountsForUser } from '$lib/models/parentAccountModel'
import { getAccountTotalsForUser } from '$lib/types/transactionModel'

export const load: PageServerLoad = async ({ depends, locals }) => {
  depends('data:accounts')
  depends('data:values')
  await connect()
  const accounts = await getAccountsForUser(Number(locals.user!.id))
  const totals = await getAccountTotalsForUser(Number(locals.user!.id))
  return {
    accounts,
    totals
  }
}