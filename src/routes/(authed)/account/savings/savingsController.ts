import type { ExpandedSavingsAccount, SuggestedTransaction } from "./types";

export function assignTransaction (amount: number, accounts: ExpandedSavingsAccount[]) {
  const total = accounts.reduce((acc, a) => acc + a.multiplier, 0)
  let amountLeft = amount
  const suggestions: SuggestedTransaction[] = accounts.map(a => {
    const amountToAccount = Number((amount * (a.multiplier / total)).toFixed(2))
    amountLeft = amountLeft - amountToAccount
    return {
      account: a.account,
      amount: amountToAccount
    }
  })
  suggestions[0].amount = suggestions[0].amount + Number(amountLeft.toFixed(2))
  return suggestions
}