import type { RequestEvent, RequestHandler } from "@sveltejs/kit";
import { json, error } from "@sveltejs/kit";
import { getTotalOnAccount, newTransaction } from "../../transactionModel";
import { AccountHierarchy } from "../../../../../params/accountHierarchy";
import { TransactionType } from "../../types";
import { assignTransaction } from "../../../account/savings/savingsController";
import { getSavingsAccountOnAccountId } from "../../../account/savings/accountTypeSavingModel";
import { currencyToString } from "$lib/utils";

type Data = {
  amount: number,
  description: string,
  type: TransactionType
}

async function validateFields ({ request, cookies, params }: RequestEvent<Partial<Record<string, string>>, string | null>) {
  const authToken = cookies.get('auth_token')
  if (!authToken) throw error(401)
  const { type, id: accountId } = params
  const data = await request.json()

  if (!data.amount) return error(400,'Transaction value must not be empty')
  if (!data.type || data.type === TransactionType.UNSELECTED) throw error(400, 'Transaction type must not be empty')
  if (!accountId) return error(400, 'Account ID cannot be empty')
  if (type === AccountHierarchy.PARENT_ACCOUNT) {
    if (data.type !== TransactionType.GROUPED_SAVING) throw error(400, `Cannot send transaction type ${data.type} to parent account`)
    if (data.amount <= 0) throw error(400, 'Grouped savings transactions cannot be negative')
  } else {
    if (data.type !== TransactionType.INDIVIDUAL) throw error(400, `Cannot send transaction type ${data.type} to account`)
  }
  return { accountId: Number(accountId), data }
}

async function handleGroupedSavingTransaction (accountId: number, data: Data) {
  const suggestions = await assignTransaction(data.amount, Number(accountId))
  const promises = suggestions.map(s => newTransaction({
    account: s.account,
    amount: s.amount,
    description: data.description
  }))
  const ids = await Promise.all(promises)
  return json({ ids }, { status: 201 })
}

async function handleIndividualTransaction (accountId: number, data: Data) {
  const savingsAccount = await getSavingsAccountOnAccountId(accountId)
  if (savingsAccount) {
    const total = await getTotalOnAccount(accountId)
    const maxTransaction = savingsAccount.target - total
    if (data.amount > maxTransaction) throw error(400, `Cannot send more than ${currencyToString(maxTransaction)} to this account`)
  }
  let id
  try {
    id = await newTransaction({...data, account: accountId})
  } catch (e) {
    console.error(e)
    return error(500, 'Failed to upload transaction. Try again.')
  }
  return json({ id }, { status: 201 })
}

export const POST: RequestHandler = async (props) => {
  const { accountId, data } = await validateFields(props)
  switch (data.type) {
    case TransactionType.GROUPED_SAVING:
      return await handleGroupedSavingTransaction(accountId, data)
    case TransactionType.INDIVIDUAL:
      return handleIndividualTransaction(accountId, data)
  }
  throw error(400, `Cannot send transaction type ${data.type} to account`)
}