import { currencyToString } from "$lib/utils";
import { error } from '@sveltejs/kit';
import type { SuggestedTransaction } from '$lib/types/accountTypes'
import { getSavingsAccountsOnParent } from '$lib/models/accountTypeSavingModel'
import { getAccountTotalsForUser } from '$lib/models/transactionModel'
import { getParentAccount } from '$lib/models/parentAccountModel'

type AccountDetails = {
  id: number,
  max: number,
  weight: number,
  amount: number
}

function distributeAmount (amount: number, accounts: AccountDetails[]): SuggestedTransaction[] {
  const maxTotal = accounts.reduce((total, account) => total + account.max, 0)
  if (maxTotal < amount) throw error(400, `Cannot send more than ${currencyToString(maxTotal)} to savings accounts`)
  let unfilledAccounts = accounts.filter(acc => acc.amount < acc.max)
  let totalWeight = unfilledAccounts.reduce((total, account) => total + account.weight, 0)
  let amountLeft = amount
  let lastAmountLeft = 0

  // Distribute the amount by weight into accounts - not above their max
  while (amountLeft > 0 && amountLeft !== lastAmountLeft) {
    lastAmountLeft = amountLeft
    for (const account of unfilledAccounts) {
      const percentToAccount = account.weight / totalWeight
      const amountToAccount = Math.floor(Math.min(lastAmountLeft * percentToAccount, (account.max - account.amount)))
      amountLeft = amountLeft - amountToAccount
      account.amount = account.amount + amountToAccount
    }

    totalWeight = unfilledAccounts.reduce((total, account) => total + account.weight, 0)
    unfilledAccounts = unfilledAccounts.filter(acc => acc.amount < acc.max)
  }
  // if there is still money left, it was not divisible. So just distribute into each account
  if (amountLeft > 0) {
    for (const account of accounts) {
      if (account.amount < account.max) {
        const amountToAdd = Math.min(account.max-account.amount, amountLeft)
        account.amount = account.amount + amountToAdd
        amountLeft = amountLeft - amountToAdd
      }
      if (amountLeft <= 0) break
    }
  }
  return accounts.map(acc => ({
    account: acc.id,
    amount: acc.amount
  }))
}

export async function assignTransaction (amount: number, accountId: number) {
  const parentAccount = await getParentAccount(accountId)
  const accounts = await getSavingsAccountsOnParent(Number(accountId))
  const totals = await getAccountTotalsForUser(parentAccount.user)
  const totalsForParent = totals[accountId]?.children ?? {}

  const detailsForAccounts: AccountDetails[] = accounts.map(account => {
    return {
      id: account.account,
      max: account.target - (totalsForParent[account.account] ?? 0),
      weight: account.multiplier,
      amount: 0
    }
  })
  return distributeAmount(amount, detailsForAccounts).filter(suggestion => suggestion.amount > 0)
}