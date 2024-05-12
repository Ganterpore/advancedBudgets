import { newAccount } from './accountModel'
import type { Account } from './types'
import { AccountType } from './types'
import type { AccountTypeBudget } from "./budget/types";
import { newBudgetAccount } from "./budget/accountTypeBudgetModel";
import { newSavingsAccount } from "./savings/accountTypeSavingModel";
import type { AccountTypeSaving } from "./savings/types";


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