import type { PageServerLoad } from './$types'
import { connect } from '$lib/db'
import { getAccountsForUser } from './parentAccount/parentAccountModel'
import { getAccountTotalsForUser } from './transactions/transactionModel'

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