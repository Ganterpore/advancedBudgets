import type { PageServerLoad } from './$types'
import { AccountHierarchy } from '../../../../../params/accountHierarchy'
import { getTransactionsOnAccount, getTransactionsOnParentAccount } from '../../transactionModel'

export const load: PageServerLoad = async ({ params }) => {
  const { id, type } = params
  let func
  switch (type) {
    case AccountHierarchy.PARENT_ACCOUNT:
      func = getTransactionsOnParentAccount
      break
    case AccountHierarchy.ACCOUNT:
    default:
      func = getTransactionsOnAccount
      break
  }
  const transactions = await func(Number(id))

  return {
    transactions
  }
}
