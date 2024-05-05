import { connect } from '../../db/db'
import type { PageServerLoad } from './$types'
import { getUserDetailsFromToken } from './auth'
import { getAccountsForUser } from '../../db/models/parentAccounts'
import { getAccountTotalsForUser } from '../../db/models/transactions'

export const load: PageServerLoad = async ({ parent, depends }) => {
  depends('data:accounts')
  depends('data:values')
  await connect()
  const { authToken } = await parent()
  const user = await getUserDetailsFromToken(authToken)
  const accounts = await getAccountsForUser(user.id)
  const totals = await getAccountTotalsForUser(user.id)
  return {
    accounts,
    totals
  }
}