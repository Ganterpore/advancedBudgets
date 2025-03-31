import type { PageServerLoad } from './$types'
import { AccountHierarchy } from '../../../../params/accountHierarchy'
import { getTransactionsOnAccount, getTransactionsOnParentAccount } from '$lib/models/transactionModel'
import type { Account, AccountNode, ParentAccount } from '$lib/types/accountTypes'
import type { TransactionWithParent } from '$lib/types/transactionTypes'

export const load: PageServerLoad = async ({ params, parent }) => {
  const { id, type } = params
  let transactionFunc: (accountId: number) => Promise<TransactionWithParent[]>
  let account: ParentAccount | Account
  let isParent: boolean
  const layout = await parent()
  switch (type) {
    case AccountHierarchy.PARENT_ACCOUNT:
      transactionFunc = getTransactionsOnParentAccount
      account = layout.accounts[Number(id)] as ParentAccount
      isParent = true
      break
    case AccountHierarchy.ACCOUNT:
    default:
      transactionFunc = getTransactionsOnAccount
      account = Object.values(layout.accounts).find((acc: AccountNode) => acc.children[Number(id)]).children[Number(id)]
      isParent = false
      break
  }
  const transactions = await transactionFunc(Number(id))

  return {
    transactions,
    account,
    isParent
  }
}
