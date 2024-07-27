import type { LayoutServerLoad } from './$types'
import { connect } from '$lib/db'
import { getAccountsForUser } from '$lib/models/parentAccountModel'

export const load: LayoutServerLoad = async ({ depends, locals }) => {
  await connect()
  depends('data:accounts')
  const accounts = await getAccountsForUser(Number(locals.user!.id))
  return {
    accounts
  }
}