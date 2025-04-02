import type { RequestHandler } from '@sveltejs/kit'
import type { TransactionData } from './[type=accountHierarchy]/[id]/+server'
import { error, json } from '@sveltejs/kit'
import { TransactionType } from '$lib/types/transactionTypes'
import { handleIndividualTransaction } from '$lib/controllers/transactionController'
import { deleteTransaction } from '$lib/models/transactionModel'

export const POST: RequestHandler = async ({ request }) => {
  const data: (TransactionData & { account: number, parent: number })[] = await request.json()
  await Promise.all(data.map(transaction => {
    if (!transaction.amount) return error(400,'Transaction value must not be empty')
    if (!transaction.type || transaction.type === TransactionType.UNSELECTED) throw error(400, 'Transaction type must not be empty')
    if (!transaction.account) return error(400, 'Account ID cannot be empty')
    // First check it passes validation (so that we can avoid a half-baked transfer if possible)
    return handleIndividualTransaction(transaction.account, transaction, { validateWithoutSending: true })
  }))
  // If all the transactions passed validation
  try {
    await Promise.all(data.map(transaction => {
      return handleIndividualTransaction(transaction.account, transaction)
    }))
    return json({}, { status: 201 })
  } catch (e) {
    console.error(e)
    throw error(500, 'Transfer failed. Warning: The transfer may have have failed halfway through.')
  }
}

export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const { transactionId } = await request.json()
    await deleteTransaction(transactionId)
    return new Response(null, { status: 204 })
  } catch (e) {
    console.error(e)
    throw error(500, `Failed to delete transaction.`)
  }
}
