import { connect } from '../../db/db'
import type { PageServerLoad, Actions } from './$types'
import { newAccount } from '../../db/models/accounts'
import { getUserDetailsFromToken } from './auth'
import { fail } from '@sveltejs/kit'

export const load: PageServerLoad = async () => {
  await connect()
}

export const actions: Actions = {
  createAccount: async function POST ({ request, cookies }) {
    const authToken = cookies.get('auth_token')
    if (!authToken) return fail(401)
    const user = await getUserDetailsFromToken(authToken)
    const data = await request.formData()
    const accountName = data.get('accountName')
    if (!accountName) return fail(400, { error: 'Account Name must not be empty' })

    return await newAccount({ user: user.id, name: accountName.toString() })
  }
}