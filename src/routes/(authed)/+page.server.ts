import type { PageServerLoad } from './$types'
import { connect } from '$lib/db'
import { getAccountsForUser } from './parentAccount/parentAccountModel'
import { getAccountTotalsForUser } from './transactions/transactionModel'
import { getUserFromToken } from "../login/userModel";

export const load: PageServerLoad = async ({ depends, cookies }) => {
  depends('data:accounts')
  depends('data:values')
  await connect()
  const authToken = cookies.get('auth_token')
  const user = await getUserFromToken(authToken!)
  const accounts = await getAccountsForUser(user!.id)
  const totals = await getAccountTotalsForUser(user!.id)
  return {
    accounts,
    totals
  }
}