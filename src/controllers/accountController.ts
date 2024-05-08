import { newAccount } from '../db/models/accounts'
import { newBudgetAccount } from '../db/models/accountTypeBudget'
import type { AccountTypeSaving } from '../db/models/accountTypeSaving'
import { newSavingsAccount } from '../db/models/accountTypeSaving'
import type { Account } from '../db/types/accounts'
import { AccountTypes } from '../db/types/accounts'
import type { AccountTypeBudget } from '../db/types/accountTypeBudget'

export async function createNewAccount (account: Account){
  const id = await newAccount(account)
  const additionalDetails = account.additionalAccountData
  switch (account.type) {
    case AccountTypes.BUDGET:
      await newBudgetAccount({ ...(additionalDetails as AccountTypeBudget), account: id })
      break
    case AccountTypes.SAVING:
      await newSavingsAccount({ ...(additionalDetails as AccountTypeSaving), account: id })
      break
  }
  return id
}