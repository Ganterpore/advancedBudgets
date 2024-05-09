import type { RequestHandler } from './$types'
import { json} from '@sveltejs/kit'
import { getUserDetailsFromToken } from '../auth'
import { newParentAccount } from './parentAccountModel'

export const POST: RequestHandler = async ({ request, cookies }) => {
  const authToken = cookies.get('auth_token')
  if (!authToken) return json({ status: 401 })

  const user = await getUserDetailsFromToken(authToken)
  const data = await request.json()
  const accountName = data.account
  if (!accountName) return json({ error: 'Account Name must not be empty' }, { status: 400 })

  const id =  await newParentAccount({ user: user!.id, name: accountName.toString() })
  return json({ id }, { status: 201 })
}