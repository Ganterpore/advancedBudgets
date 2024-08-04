import type { PageServerLoad } from './$types'
import * as budgetModel from '$lib/models/budgetModel'
import { FrequencyCategory } from '$lib/types/sharedTypes'
import type { Budget } from '$lib/types/budgetTypes'
import { getTotalOnIncomeAccountsSince } from '$lib/types/transactionModel'
import { getNextOccurrence, numberOfOccurrencesBetween } from '$lib/dayOfWeekFunctons'
import { getAllBudgetAccountsForUser } from '$lib/models/accountTypeBudgetModel'
import type { AccountNode, ExpandedBudgetAccount } from '$lib/types/accountTypes'
import { BudgetAccountType } from '$lib/types/accountTypes'
import { getAllExcessAccounts } from '$lib/models/budgetExcessModel'
import type { TransactionData } from '../transactions/[type=accountHierarchy]/[id]/+server'
import { TransactionType } from '$lib/types/transactionTypes'
import { minimizeTransactions } from '$lib/helpers/transactionHelpers'

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

  const transactions: (TransactionData & { account: number, parent: number })[] = []

  depends('data:values')
  const incomeOnAccounts = await getTotalOnIncomeAccountsSince(userId)
  for (const income of incomeOnAccounts) {
    transactions.push({
      parent: income.parent,
      account: income.account,
      description: 'Budget - Income',
      type: TransactionType.INDIVIDUAL,
      amount: -1 * income.total
    })
  }
  const incomeSinceLast = incomeOnAccounts.reduce((total, i) => total + i.total, 0)
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
    const amountInAccount = totals[b.parent]?.children[b.account] ?? 0
    const cappedAmountToAdd = Math.min(maxAmountToAdd, b.budgetMax - amountInAccount)
    const parentName = accounts[b.parent].name
    return {
      id: b.account,
      name: b.name,
      parent: b.parent,
      parentName,
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
    transactions.push({
      parent: a.parent,
      account: a.id,
      amount: adding,
      description: 'Budget - Needs',
      type: TransactionType.INDIVIDUAL
    })
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
    transactions.push({
      parent: a.parent,
      account: a.id,
      amount: adding,
      description: 'Budget - Wants',
      type: TransactionType.INDIVIDUAL
    })
  })
  if (incomeLeft < 10) {
    amountToWants[0].actualAmountAdded += incomeLeft
    incomeLeft = 0
  }

  depends('data:excess')
  const excessAccounts = await getAllExcessAccounts(userId)
  const totalProportion = excessAccounts.reduce((total, acc) => total + Number(acc.proportion), 0)
  const excessIncome = incomeLeft
  const excessAccountsWithNames = excessAccounts.map(ex => {
    const parentAccount: AccountNode = Object.values(accounts).find((a: AccountNode) => a.children[ex.account])
    const actualAmountAdded = Math.floor((ex.proportion / totalProportion) * excessIncome)
    incomeLeft -= actualAmountAdded
    transactions.push({
      parent: parentAccount.id,
      account: ex.account,
      amount: actualAmountAdded,
      description: 'Budget - Excess',
      type: TransactionType.INDIVIDUAL
    })
    return {
      ...ex,
      name: `${parentAccount.name}: ${parentAccount.children[ex.account].name}`,
      actualAmountAdded
    }
  })
  if (incomeLeft > 0) {
    excessAccountsWithNames[0].actualAmountAdded += incomeLeft
    incomeLeft = 0
  }


  // Get the net changes between parent accounts
  const parentBalances: { [name: string]: number } = {}
  for (const t of transactions) {
    const parent = accounts[t.parent]
    if (!parentBalances[parent.name]) parentBalances[parent.name] = 0
    parentBalances[parent.name] += t.amount
  }
  const parentTransactions = minimizeTransactions(
    Object.keys(parentBalances).map(name => ({ name, balance: parentBalances[name] }))
  )
  return {
    budget,
    excessAccounts: excessAccountsWithNames,
    incomeSinceLast,
    budgetStartDate,
    isReadyToRelease,
    amountToNeeds,
    amountToWants,
    excess: excessIncome,
    transactions,
    parentTransactions
  }
}
