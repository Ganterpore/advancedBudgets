import type { Account, AccountTypeBudget, AccountTypeSaving } from '$lib/types/accountTypes'
import * as accountModel from '$lib/models/accountModel'
import { AccountType } from '$lib/types/accountTypes'
import { newBudgetAccount, updateBudgetAccount } from '$lib/models/accountTypeBudgetModel'
import { newSavingsAccount, updateSavingsAccount } from '$lib/models/accountTypeSavingModel'


export async function createNewAccount (account: Omit<Account, 'id'>){
  const id = await accountModel.newAccount(account)
  const additionalDetails = account.additionalAccountData
  switch (account.type) {
    case AccountType.BUDGET:
    case AccountType.PLANNED:
      await newBudgetAccount({ ...(additionalDetails as AccountTypeBudget), account: id })
      break
    case AccountType.SAVING:
      await newSavingsAccount({ ...(additionalDetails as AccountTypeSaving), account: id })
      break
  }
  return id
}

export async function updateAccount (account: Account): Promise<void> {
  await accountModel.updateAccount(account)
  const additionalDetails = account.additionalAccountData
  switch (account.type) {
    case AccountType.BUDGET:
    case AccountType.PLANNED:
      await updateBudgetAccount({ ...(additionalDetails as AccountTypeBudget), account: account.id })
      break
    case AccountType.SAVING:
      await updateSavingsAccount({ ...(additionalDetails as AccountTypeSaving), account: account.id })
      break
  }
}