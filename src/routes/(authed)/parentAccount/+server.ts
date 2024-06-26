import type { RequestHandler } from './$types'
import { json} from '@sveltejs/kit'
import { newParentAccount } from '$lib/models/parentAccountModel'

export const POST: RequestHandler = async ({ request, locals }) => {
  const data = await request.json()
  const accountName = data.account
  if (!accountName) return json({ error: 'Account Name must not be empty' }, { status: 400 })

  const id =  await newParentAccount({ user: Number(locals.user!.id), name: accountName.toString() })
  return json({ id }, { status: 201 })
}