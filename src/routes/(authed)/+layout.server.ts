import type { LayoutServerLoad } from './$types'
import { connect } from '$lib/db'
import { getAccountsForUser } from '$lib/models/parentAccountModel'
import { getAccountTotalsForUser } from '$lib/types/transactionModel'

export const load: LayoutServerLoad = async ({ depends, locals }) => {
  await connect()
  depends('data:accounts')
  const accounts = await getAccountsForUser(Number(locals.user!.id))

  depends('data:values')
  const totals = await getAccountTotalsForUser(Number(locals.user!.id))
  return {
    accounts,
    totals
  }
}