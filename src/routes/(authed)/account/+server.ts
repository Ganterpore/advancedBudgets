import type { RequestHandler } from './$types'
import { json} from '@sveltejs/kit'
import { createNewAccount } from '$lib/controllers/accountController'

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json()
  if (!data.name) return json({ error: 'Account Name must not be empty' }, { status: 400 })
  if (!data.type) return json({ error: 'Account type must not be empty' }, { status: 400 })
  if (!data.parent) return json({ error: 'Account parent must not be empty' }, { status: 400 })

  const id =  await createNewAccount(data)
  return json({ id }, { status: 201 })
}