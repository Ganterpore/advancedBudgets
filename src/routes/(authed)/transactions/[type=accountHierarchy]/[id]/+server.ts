import type { RequestEvent, RequestHandler } from "@sveltejs/kit";
import { error, json } from "@sveltejs/kit";
import { getTotalOnAccount, newTransaction } from "../../transactionModel";
import { AccountHierarchy } from "../../../../../params/accountHierarchy";
import { TransactionType } from "../../types";
import { assignTransaction } from "../../../account/savings/savingsController";
import { getSavingsAccountOnAccountId } from "../../../account/savings/accountTypeSavingModel";
import { currencyToString } from "$lib/utils";

export type TransactionData = {
  amount: number,
  description: string,
  type: TransactionType,
  transferTo?: number
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
    const validIndividualTransactions = [TransactionType.INDIVIDUAL, TransactionType.TRANSFER]
    if (!validIndividualTransactions.includes(data.type)) throw error(400, `Cannot send transaction type ${data.type} to account`)
  }
  return { accountId: Number(accountId), data }
}

async function handleGroupedSavingTransaction (accountId: number, data: TransactionData) {
  const suggestions = await assignTransaction(data.amount, Number(accountId))
  const promises = suggestions.map(s => newTransaction({
    account: s.account,
    amount: s.amount,
    description: data.description
  }))
  const ids = await Promise.all(promises)
  return json({ ids }, { status: 201 })
}

async function handleIndividualTransaction (accountId: number, data: TransactionData, props?: { validateWithoutSending?: boolean}) {
  const savingsAccount = await getSavingsAccountOnAccountId(accountId)
  if (savingsAccount) {
    const total = await getTotalOnAccount(accountId)
    const maxTransaction = savingsAccount.target - total
    if (data.amount > maxTransaction) throw error(400, `Cannot send more than ${currencyToString(maxTransaction)} to this account`)
  }
  if (props?.validateWithoutSending) return json({ status: 204 })
  let id
  try {
    id = await newTransaction({...data, account: accountId})
  } catch (e) {
    console.error(e)
    return error(500, 'Failed to upload transaction. Try again.')
  }
  return json({ id }, { status: 201 })
}

async function handleTransfer (from: number, to: number, data: TransactionData) {
  const fromData = {...data, amount: data.amount * -1}
  // First check it passes validation (so that we can avoid a half baked transfer if possible)
  await handleIndividualTransaction(from, fromData, { validateWithoutSending: true })
  await handleIndividualTransaction(to, data, { validateWithoutSending: true })

  try {
    await handleIndividualTransaction(from, fromData)
    return await handleIndividualTransaction(to, data)
  } catch (e) {
    console.log(e)
    throw error(500, 'Transfer failed. Warning: The transfer may have have failed halfway through.')
  }
}

export const POST: RequestHandler = async (props) => {
  const { accountId, data } = await validateFields(props)
  switch (data.type) {
    case TransactionType.TRANSFER:
      return await handleTransfer(accountId, data.transferTo, data)
    case TransactionType.GROUPED_SAVING:
      return await handleGroupedSavingTransaction(accountId, data)
    case TransactionType.INDIVIDUAL:
      return handleIndividualTransaction(accountId, data)
  }
  throw error(400, `Cannot send transaction type ${data.type} to account`)
}