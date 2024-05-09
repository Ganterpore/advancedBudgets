import type { RequestHandler } from './$types'
import { json} from '@sveltejs/kit'
import { newTransaction } from './transactionModel'

export const POST: RequestHandler = async ({ request, cookies }) => {
  const authToken = cookies.get('auth_token')
  if (!authToken) return json({ status: 401 })

  const data = await request.json()
  if (!data.amount) return json({ error: 'Transaction value must not be empty' }, { status: 400 })
  if (!data.account) return json({ error: 'Transaction account must not be empty' }, { status: 400 })

  let id
  try {
    id = await newTransaction(data)
  } catch (e) {
    console.log(e)
    return json({ error: 'Failed to upload transaction. Try again.'}, { status: 500 })
  }
  return json({ id }, { status: 201 })
}