import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import { newTransaction } from "../../transactionModel";
import { AccountHierarchy } from "../../../../../params/accountHierarchy";

export const POST: RequestHandler = async ({ request, cookies, params }) => {
  const authToken = cookies.get('auth_token')
  if (!authToken) return json({ status: 401 })

  const data = await request.json()
  if (!data.amount) return json({ error: 'Transaction value must not be empty' }, { status: 400 })
  const { type, id: accountId } = params
  if (type === AccountHierarchy.PARENT_ACCOUNT) return json({ error: 'Cannot send transaction to parent account' }, { status: 400 })
  if (!accountId) return json({ error: 'Account ID cannot be empty' }, { status: 400 })

  let id
  try {
    id = await newTransaction({...data, account: accountId})
  } catch (e) {
    console.error(e)
    return json({ error: 'Failed to upload transaction. Try again.'}, { status: 500 })
  }
  return json({ id }, { status: 201 })
}