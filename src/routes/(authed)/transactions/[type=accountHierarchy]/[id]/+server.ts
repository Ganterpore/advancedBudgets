import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import { newTransaction } from "../../transactionModel";
import { AccountHierarchy } from "../../../../../params/accountHierarchy";
import { TransactionType } from "../../types";
import { getSavingsAccountsOnParent } from "../../../account/savings/accountTypeSavingModel";
import { assignTransaction } from "../../../account/savings/savingsController";

export const POST: RequestHandler = async ({ request, cookies, params }) => {
  const authToken = cookies.get('auth_token')
  if (!authToken) return json({ status: 401 })
  const { type, id: accountId } = params
  const data = await request.json()

  if (!data.amount) return json({ error: 'Transaction value must not be empty' }, { status: 400 })
  if (!data.type || data.type === TransactionType.UNSELECTED) return json({ error: 'Transaction type must not be empty' }, { status: 400 })
  if (!accountId) return json({ error: 'Account ID cannot be empty' }, { status: 400 })

  if (type === AccountHierarchy.PARENT_ACCOUNT) {
    if (data.type !== TransactionType.GROUPED_SAVING) return json({ error: `Cannot send transaction type ${data.type} to parent account` }, { status: 400 })
    const accounts = await getSavingsAccountsOnParent(Number(accountId))
    const suggestions = assignTransaction(data.amount, accounts)
    const promises = suggestions.map(s => newTransaction({
      account: s.account,
      amount: s.amount,
      description: data.description
    }))
    const ids = await Promise.all(promises)
    return json({ ids }, { status: 201 })
  }
  if (data.type !== TransactionType.INDIVIDUAL) return json({ error: `Cannot send transaction type ${data.type} to account` }, { status: 400 })

  let id
  try {
    id = await newTransaction({...data, account: accountId})
  } catch (e) {
    console.error(e)
    return json({ error: 'Failed to upload transaction. Try again.'}, { status: 500 })
  }
  return json({ id }, { status: 201 })
}