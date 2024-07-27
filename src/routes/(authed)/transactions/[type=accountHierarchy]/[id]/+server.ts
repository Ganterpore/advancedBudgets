import type { RequestEvent, RequestHandler } from "@sveltejs/kit";
import { error, json } from "@sveltejs/kit";
import { AccountHierarchy } from '../../../../../params/accountHierarchy'
import { currencyToString } from "$lib/utils";
import { TransactionType } from '$lib/types/transactionTypes'
import { assignTransaction } from '$lib/controllers/savingsController'
import { getTotalOnAccount, newTransaction } from '$lib/types/transactionModel'
import { completeAccount, getSavingsAccountOnAccountId } from '$lib/models/accountTypeSavingModel'

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
  if (!from || !to) throw error(400, 'Transferals must have a to and from account')
  const fromData = {...data, amount: data.amount * -1}
  // First check it passes validation (so that we can avoid a half baked transfer if possible)
  await handleIndividualTransaction(from, fromData, { validateWithoutSending: true })
  await handleIndividualTransaction(to, data, { validateWithoutSending: true })

  try {
    await handleIndividualTransaction(from, fromData)
    return await handleIndividualTransaction(to, data)
  } catch (e) {
    console.error(e)
    throw error(500, 'Transfer failed. Warning: The transfer may have have failed halfway through.')
  }
}

async function handleCompletion (accountId: number, data: TransactionData) {
  // Validate the account can be completed
  const total = await getTotalOnAccount(accountId)
  const savingsAccount = await getSavingsAccountOnAccountId(accountId)
  if (!savingsAccount) throw error(400, 'Completions can only be done on savings accounts')
  if (total !== savingsAccount.target) throw error(400, 'Savings account must be at target to complete')
  if (data.amount <= 0) throw error(400, 'Actual amount spent must be greater than 0')
  const amountToTransfer = savingsAccount.target - data.amount
  if (amountToTransfer !== 0 && !data.transferTo) throw error(400, 'If the amount spent was not the same as the target, an account to transfer the remaining funds from/to must be specified')
  // Remove the amount spent from the account
  const res = await handleIndividualTransaction(accountId, { ...data, amount: data.amount * -1})
  // Transfer the remaining amount into/out of account
  if (amountToTransfer !== 0) {
    await handleTransfer(accountId, data.transferTo!, {...data, amount: amountToTransfer})
  }
  // Mark the account as completed
  await completeAccount(savingsAccount.id)
  return res
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