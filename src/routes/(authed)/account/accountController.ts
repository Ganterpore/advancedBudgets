import type { Account, AccountTypeBudget, AccountTypeSaving } from './types'
import { newAccount } from './accountModel'
import { newBudgetAccount } from './accountTypeBudgetModel'
import { AccountType } from './types'
import { newSavingsAccount } from './accountTypeSavingModel'


export async function createNewAccount (account: Account){
  const id = await newAccount(account)
  const additionalDetails = account.additionalAccountData
  switch (account.type) {
    case AccountType.BUDGET:
      await newBudgetAccount({ ...(additionalDetails as AccountTypeBudget), account: id })
      break
    case AccountType.SAVING:
      await newSavingsAccount({ ...(additionalDetails as AccountTypeSaving), account: id })
      break
  }
  return id
}