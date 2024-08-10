import type { RequestEvent, RequestHandler } from "@sveltejs/kit";
import { error, json } from "@sveltejs/kit";
import { AccountHierarchy } from '../../../../../params/accountHierarchy'
import { TransactionType } from '$lib/types/transactionTypes'
import { assignTransaction } from '$lib/controllers/savingsController'
import { newTransaction } from '$lib/types/transactionModel'
import { handleCompletion, handleIndividualTransaction, handleTransfer } from '$lib/controllers/transactionController'

export type TransactionData = {
  amount: number,
  description: string,
  type: TransactionType,
  transferTo?: number
}

async function validateFields ({ request, params }: RequestEvent<Partial<Record<string, string>>, string | null>) {
  const { type, id: accountId } = params
  const data = await request.json()

  if (!data.amount) return error(400,'Transaction value must not be empty')
  if (!data.type || data.type === TransactionType.UNSELECTED) throw error(400, 'Transaction type must not be empty')
  if (!accountId) return error(400, 'Account ID cannot be empty')
  if (type === AccountHierarchy.PARENT_ACCOUNT) {
    if (data.type !== TransactionType.GROUPED_SAVING) throw error(400, `Cannot send transaction type ${data.type} to parent account`)
    if (data.amount <= 0) throw error(400, 'Grouped savings transactions cannot be negative')
  } else {
    const validIndividualTransactions = [TransactionType.INDIVIDUAL, TransactionType.TRANSFER, TransactionType.COMPLETION]
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


export const POST: RequestHandler = async (props) => {
  const { accountId, data } = await validateFields(props)
  switch (data.type) {
    case TransactionType.COMPLETION:
      return await handleCompletion(accountId, data)
    case TransactionType.TRANSFER:
      return await handleTransfer(accountId, data.transferTo, data)
    case TransactionType.GROUPED_SAVING:
      return await handleGroupedSavingTransaction(accountId, data)
    case TransactionType.INDIVIDUAL:
      return handleIndividualTransaction(accountId, data)
  }
  throw error(400, `Cannot send transaction type ${data.type} to account`)
}