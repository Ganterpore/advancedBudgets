import type { PageServerLoad } from './$types'
import { TransactionListType } from '../../../../../params/transactionListType'
import { getTransactionsOnAccount, getTransactionsOnParentAccount } from '../../transactionModel'

export const load: PageServerLoad = async ({ params }) => {
  const { id, list } = params
  let func
  switch (list) {
    case TransactionListType.PARENT_ACCOUNT:
      func = getTransactionsOnParentAccount
      break
    case TransactionListType.ACCOUNT:
    default:
      func = getTransactionsOnAccount
      break
  }
  const transactions = await func(Number(id))

  return {
    transactions
  }
}
