import type { LayoutServerLoad } from './$types'
import { connect } from '$lib/db'
import { getAccountsForUser } from '$lib/models/parentAccountModel'
import { getAccountTotalsForUser } from '$lib/types/transactionModel'
import { getInvestmentsOnUser } from '$lib/models/investmentModel'

export const load: LayoutServerLoad = async ({ depends, locals }) => {
  await connect()
  depends('data:accounts')
  const userId = Number(locals.user!.id)
  const accounts = await getAccountsForUser(userId)
  const investments = await getInvestmentsOnUser(userId)

  depends('data:values')
  const totals = await getAccountTotalsForUser(userId)
  return {
    accounts,
    totals,
    investments
  }
}