import type { RequestHandler } from "@sveltejs/kit";
import { json, error } from "@sveltejs/kit";
import { newTransaction } from "../../transactionModel";
import { AccountHierarchy } from "../../../../../params/accountHierarchy";
import { TransactionType } from "../../types";
import { assignTransaction } from "../../../account/savings/savingsController";

export const POST: RequestHandler = async ({ request, cookies, params }) => {
  const authToken = cookies.get('auth_token')
  if (!authToken) return json({ status: 401 })
  const { type, id: accountId } = params
  const data = await request.json()

  if (!data.amount) return error(400,'Transaction value must not be empty')
  if (!data.type || data.type === TransactionType.UNSELECTED) return error(400, 'Transaction type must not be empty')
  if (!accountId) return error(400, 'Account ID cannot be empty')

  if (type === AccountHierarchy.PARENT_ACCOUNT) {
    if (data.type !== TransactionType.GROUPED_SAVING) return error(400, `Cannot send transaction type ${data.type} to parent account`)
    if (data.amount <= 0) return error(400, 'Grouped savings transactions cannot be negative')
    const suggestions = await assignTransaction(data.amount, Number(accountId))
    const promises = suggestions.map(s => newTransaction({
      account: s.account,
      amount: s.amount,
      description: data.description
    }))
    const ids = await Promise.all(promises)
    return json({ ids }, { status: 201 })
  }
  if (data.type !== TransactionType.INDIVIDUAL) return error(400, `Cannot send transaction type ${data.type} to account`)

  let id
  try {
    id = await newTransaction({...data, account: accountId})
  } catch (e) {
    console.error(e)
    return error(500, 'Failed to upload transaction. Try again.')
  }
  return json({ id }, { status: 201 })
}