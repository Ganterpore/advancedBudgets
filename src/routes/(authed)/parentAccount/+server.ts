import type { RequestHandler } from './$types'
import { json} from '@sveltejs/kit'
import { newParentAccount } from './parentAccountModel'
import { getUserFromToken } from "../../login/userModel";
import { validateToken } from '$lib/utils'

export const POST: RequestHandler = async ({ request, cookies }) => {
  const authToken = cookies.get('auth_token')
  if (!authToken || !(await validateToken(authToken))) return json({ status: 401 })

  const user = await getUserFromToken(authToken)
  const data = await request.json()
  const accountName = data.account
  if (!accountName) return json({ error: 'Account Name must not be empty' }, { status: 400 })

  const id =  await newParentAccount({ user: user!.id, name: accountName.toString() })
  return json({ id }, { status: 201 })
}