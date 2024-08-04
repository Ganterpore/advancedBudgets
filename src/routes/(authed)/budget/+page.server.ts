import type { PageServerLoad } from './$types'
import * as budgetModel from '$lib/models/budgetModel'
import { FrequencyCategory } from '$lib/types/sharedTypes'
import type { Budget } from '$lib/types/budgetTypes'
import { getTotalOnIncomeAccountsSince } from '$lib/types/transactionModel'
import { getNextOccurrence, numberOfOccurrencesBetween } from '$lib/dayOfWeekFunctons'
import { getAllBudgetAccountsForUser } from '$lib/models/accountTypeBudgetModel'
import type { AccountNode } from '$lib/types/accountTypes'
import { BudgetAccountType } from '$lib/types/accountTypes'
import type { ExpandedBudgetAccount } from '$lib/types/accountTypes'
import { getAllExcessAccounts } from '$lib/models/budgetExcessModel'

export const load: PageServerLoad = async ({ depends, locals, parent }) => {
  const userId = Number(locals.user!.id)
  const layout = await parent()
  const { totals, accounts } = layout

  depends('data:budget')
  let budget: Budget | undefined = await budgetModel.getBudgetForUser(userId)
  if (!budget) {
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    const newBudget = {
      user: Number(locals.user!.id),
      frequency: 1,
      frequencyCategory: FrequencyCategory.MONTHLY,
      dayOf: 15,
      lastBudget: oneMonthAgo
    }
    const id = await budgetModel.newBudget(newBudget)
    budget = {
      ...newBudget,
      id
    }
  }

  depends('data:excess')
  const excessAccounts = await getAllExcessAccounts(userId)
  const excessAccountsWithNames = excessAccounts.map(ex => {
    const account: AccountNode = Object.values(accounts).find((a: AccountNode) => a.children[ex.account])
    return {
      ...ex,
      name: `${account.name}: ${account.children[ex.account].name}`
    }
  })

  depends('data:values')
  const incomeSinceLast = await getTotalOnIncomeAccountsSince(userId, budget.lastBudget)
  const budgetStartDate = getNextOccurrence(budget, budget.lastBudget)
  const isReadyToRelease = budgetStartDate < new Date()
  const budgetEndDate = getNextOccurrence(budget, new Date(Math.max(
    budgetStartDate.getTime(),
    Date.now()
  )))

  // Get all the budget accounts for the user
  const budgetAccounts = await getAllBudgetAccountsForUser(userId)
  const needsBudgets = budgetAccounts.filter(b => b.type ===BudgetAccountType.NEED)
  const wantsBudgets = budgetAccounts.filter(b => b.type ===BudgetAccountType.WANT)

  const createBudgetMap = (b: ExpandedBudgetAccount) => {
    const numberOfOccurencesThisBudget = numberOfOccurrencesBetween(b, budgetStartDate, budgetEndDate)
    const maxAmountToAdd = numberOfOccurencesThisBudget * b.regularBudget
    const amountInAccount = totals[b.parent].children[b.account] ?? 0
    const cappedAmountToAdd = Math.min(maxAmountToAdd, b.budgetMax - amountInAccount)
    return {
      id: b.account,
      name: b.name,
      type: b.type,
      maxAmountToAdd: isReadyToRelease ? cappedAmountToAdd : maxAmountToAdd,
      actualAmountAdded: 0
    }
  }

  // Tracking how much budget to give to all needs
  const amountToNeeds = needsBudgets.map(createBudgetMap)
  const needsTotalAmount = amountToNeeds.reduce((total, budget) => total + budget.maxAmountToAdd, 0)
  const percentageNeedsPayable = Math.min(1, (incomeSinceLast / needsTotalAmount))
  let incomeLeft = incomeSinceLast
  amountToNeeds.forEach(a => {
    const adding = Math.floor(a.maxAmountToAdd * percentageNeedsPayable)
    a.actualAmountAdded = adding
    incomeLeft -= adding
  })
  if (incomeLeft < 10) {
    amountToNeeds[0].actualAmountAdded += incomeLeft
    incomeLeft = 0
  }

  // Tracking how much budget to give to all wants
  const amountToWants = wantsBudgets.map(createBudgetMap)
  const wantsTotalAmount = amountToWants.reduce((total, budget) => total + budget.maxAmountToAdd, 0)
  const percentageWantsPayable= Math.min(1, (incomeLeft / wantsTotalAmount))
  amountToWants.forEach(a => {
    const adding = Math.floor(a.maxAmountToAdd * percentageWantsPayable)
    a.actualAmountAdded = adding
    incomeLeft -= adding
  })
  if (incomeLeft < 10) {
    amountToWants[0].actualAmountAdded += incomeLeft
    incomeLeft = 0
  }

  // TODO track which and how much to excess accounts
  return {
    budget,
    excessAccounts: excessAccountsWithNames,
    incomeSinceLast,
    budgetStartDate,
    isReadyToRelease,
    amountToNeeds,
    amountToWants,
    excess: incomeLeft
  }
}
