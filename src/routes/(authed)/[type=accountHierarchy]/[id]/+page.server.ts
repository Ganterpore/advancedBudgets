import type { PageServerLoad } from './$types'
import { AccountHierarchy } from '../../../../params/accountHierarchy'
import { getTransactionsOnAccount, getTransactionsOnParentAccount } from '$lib/types/transactionModel'
import { getParentAccount } from '$lib/models/parentAccountModel'
import { getAccount } from '$lib/models/accountModel'

export const load: PageServerLoad = async ({ params }) => {
  const { id, type } = params
  let transactionFunc, accountFunc
  switch (type) {
    case AccountHierarchy.PARENT_ACCOUNT:
      transactionFunc = getTransactionsOnParentAccount
      accountFunc = getParentAccount
      break
    case AccountHierarchy.ACCOUNT:
    default:
      transactionFunc = getTransactionsOnAccount
      accountFunc = getAccount
      break
  }
  const transactions = await transactionFunc(Number(id))
  const account = await accountFunc(Number(id))

  return {
    transactions,
    account
  }
}
