import { connect } from '../../db/db'
import type { PageServerLoad } from './$types'
import { getUserDetailsFromToken } from './auth'
import { getAccountsForUser } from '../../db/models/parentAccounts'

export const load: PageServerLoad = async ({ parent, depends }) => {
  depends('data:accounts')
  await connect()
  const { authToken } = await parent()
  const user = await getUserDetailsFromToken(authToken)
  const accounts = await getAccountsForUser(user.id)
  return {
    accounts
  }
}