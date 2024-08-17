import { completeAccount, getSavingsAccountOnAccountId } from '$lib/models/accountTypeSavingModel'
import { getTotalOnAccount, newTransaction } from '$lib/types/transactionModel'
import { error, json } from '@sveltejs/kit'
import { currencyToString } from '$lib/utils'
import type { TransactionData } from '../../routes/(authed)/transactions/[type=accountHierarchy]/[id]/+server'
import { archiveAccount } from '$lib/models/accountModel'

export async function handleIndividualTransaction (accountId: number, data: TransactionData, props?: { validateWithoutSending?: boolean}) {
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

export async function handleTransfer (from: number, to: number, data: TransactionData) {
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

export async function handleCompletion (accountId: number, data: TransactionData) {
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
  await archiveAccount(savingsAccount.account)
  return res
}