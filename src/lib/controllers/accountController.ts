import type { Account, AccountTypeBudget, AccountTypeSaving } from '$lib/types/accountTypes'
import { newAccount } from '$lib/models/accountModel'
import { AccountType } from '$lib/types/accountTypes'
import { newBudgetAccount } from '$lib/models/accountTypeBudgetModel'
import { newSavingsAccount } from '$lib/models/accountTypeSavingModel'


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