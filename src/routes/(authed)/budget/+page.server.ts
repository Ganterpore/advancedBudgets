import type { PageServerLoad } from './$types'
import * as budgetModel from '$lib/models/budgetModel'
import { getTotalOnIncomeAccounts } from '$lib/types/transactionModel'
import { getAllBudgetAccountsForUser } from '$lib/models/accountTypeBudgetModel'
import type { AccountNode, ExpandedBudgetAccount } from '$lib/types/accountTypes'
import { BudgetAccountType } from '$lib/types/accountTypes'
import { getAllExcessAccounts } from '$lib/models/budgetExcessModel'
import type { TransactionData } from '../transactions/[type=accountHierarchy]/[id]/+server'
import { TransactionType } from '$lib/types/transactionTypes'
import { minimizeTransactions } from '$lib/helpers/transactionHelpers'
import { getAllBudgetSavingsAccounts } from '$lib/models/budgetSavingsModel'
import { getEstimateExcessFromInvestment, getIncomeFromInvestment } from '$lib/helpers/budgetHelpers'
import {
  getBudgetedAmountOverPeriod,
  getBudgetPeriodsPerYear,
  getCurrentBudgetPeriod
} from '$lib/controllers/budgetController'

export const load: PageServerLoad = async ({ depends, locals, parent }) => {
  const userId = Number(locals.user!.id)
  const layout = await parent()
  const { totals, accounts, investments } = layout

  depends('data:budget')
  const budget = await budgetModel.getOrCreateBudgetForUser(userId)
  const [budgetStartDate, budgetEndDate] = getCurrentBudgetPeriod(budget)
  const isReadyToRelease = budgetStartDate < new Date()
  const budgetPeriodsPerYear = getBudgetPeriodsPerYear(budget)

  const transactions: (TransactionData & { account: number, parent: number })[] = []
  const investmentTransactions: (TransactionData & { name: string })[] = []

  depends('data:values')
  const incomeOnAccounts = await getTotalOnIncomeAccounts(userId)
  for (const income of incomeOnAccounts) {
    if (income.total > 0) {
      transactions.push({
        parent: income.parent,
        account: income.account,
        description: 'Budget - Income',
        type: TransactionType.INDIVIDUAL,
        amount: -1 * income.total
      })
    }
  }
  const investmentIncome = investments.map(inv => {
    const income = getIncomeFromInvestment(inv, budgetPeriodsPerYear)
    const estimatedTotalIncome = getEstimateExcessFromInvestment(inv, budgetPeriodsPerYear)
    if (income > 0) {
      investmentTransactions.push({
        amount: -1 * income,
        description: 'Budget - Excess',
        type: TransactionType.INDIVIDUAL,
        transferTo: inv.id,
        name: inv.name
      })
    }
    return { name: inv.name, income, estimatedTotalIncome }
  })

  // Get all the budget accounts for the user
  const incomeSinceLast = incomeOnAccounts.reduce((total, i) => total + i.total, 0)
    + investmentIncome.reduce((total, inv) => total + inv.income, 0)
  const budgetAccounts = await getAllBudgetAccountsForUser(userId)
  const needsBudgets = budgetAccounts.filter(b => b.type === BudgetAccountType.NEED)
  const wantsBudgets = budgetAccounts.filter(b => b.type === BudgetAccountType.WANT)

  const createBudgetMap = (b: ExpandedBudgetAccount) => {
    const maxAmountToAdd = getBudgetedAmountOverPeriod(b, budgetStartDate, budgetEndDate)
    const amountInAccount = totals[b.parent]?.children[b.account] ?? 0
    const cappedAmountToAdd = Math.min(maxAmountToAdd, Math.max(b.budgetMax - amountInAccount, 0))
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
    if (adding > 0) {
      transactions.push({
        parent: a.parent,
        account: a.id,
        amount: adding,
        description: 'Budget - Needs',
        type: TransactionType.INDIVIDUAL
      })
    }
  })
  if (incomeLeft < 10 && amountToNeeds[0]) {
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
    if (adding > 0) {
      transactions.push({
        parent: a.parent,
        account: a.id,
        amount: adding,
        description: 'Budget - Wants',
        type: TransactionType.INDIVIDUAL
      })
    }
  })
  if (incomeLeft < 10 && amountToWants[0]) {
    amountToWants[0].actualAmountAdded += incomeLeft
    incomeLeft = 0
  }

  depends('data:budgetSavings')
  const budgetSavingsAccounts = await getAllBudgetSavingsAccounts(userId)
  const savingsIncome = incomeLeft
  const totalSavingsRequired = budgetSavingsAccounts.reduce((total, acc) => total + Number(acc.max), 0)
  const budgetSavingsAccountsWithNames = budgetSavingsAccounts.map(acc => {
    const amountAdded = Math.min(
      acc.max,
      totalSavingsRequired ? (acc.max / totalSavingsRequired) * savingsIncome : 0
    )
    incomeLeft -= amountAdded
    let name
    if (acc.type === 'investment') {
      const investment = investments.find(inv => inv.id === acc.account)
      name = investment?.name ?? ''
      if (amountAdded > 0) {
        investmentTransactions.push({
          amount: amountAdded,
          description: 'Budget - Excess',
          type: TransactionType.INDIVIDUAL,
          transferTo: acc.account,
          name
        })
      }
    } else {
      const parentAccount: AccountNode = Object.values(accounts).find((a: AccountNode) => a.children[acc.account])
      name = `${parentAccount.name}: ${parentAccount.children[acc.account].name}`
      if (amountAdded > 0) {
        transactions.push({
          parent: parentAccount.id,
          account: acc.account,
          amount: amountAdded,
          description: 'Budget - Excess',
          type: TransactionType.INDIVIDUAL
        })
      }
    }
    return {
      ...acc,
      name,
      actualAmountAdded: amountAdded
    }
  })

  depends('data:excess')
  const excessAccounts = await getAllExcessAccounts(userId)
  const totalProportion = excessAccounts.reduce((total, acc) => total + Number(acc.proportion), 0)
  const excessIncome = incomeLeft
  const excessAccountsWithNames = excessAccounts.map(ex => {
    const actualAmountAdded = totalProportion ? Math.floor((ex.proportion / totalProportion) * excessIncome) : 0
    incomeLeft -= actualAmountAdded

    let name
    if (ex.type === 'investment') {
      const investment = investments.find(inv => inv.id === ex.account)
      name = investment?.name ?? ''
      if (actualAmountAdded > 0) {
        investmentTransactions.push({
          amount: actualAmountAdded,
          description: 'Budget - Excess',
          type: TransactionType.INDIVIDUAL,
          transferTo: ex.account,
          name
        })
      }
    } else {
      const parentAccount: AccountNode = Object.values(accounts).find((a: AccountNode) => a.children[ex.account])
      name = `${parentAccount.name}: ${parentAccount.children[ex.account].name}`
      if (actualAmountAdded > 0) {
        transactions.push({
          parent: parentAccount.id,
          account: ex.account,
          amount: actualAmountAdded,
          description: 'Budget - Excess',
          type: TransactionType.INDIVIDUAL
        })
      }
    }
    return {
      ...ex,
      name,
      actualAmountAdded
    }
  })
  if (incomeLeft > 0 && excessAccountsWithNames[0]) {
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
  for (const t of investmentTransactions) {
    if (!parentBalances[t.name]) parentBalances[t.name] = 0
    parentBalances[t.name] += t.amount
  }
  const parentTransactions = minimizeTransactions(
    Object.keys(parentBalances).map(name => ({ name, balance: parentBalances[name] }))
  )
  return {
    budget,
    savingsAccounts: budgetSavingsAccountsWithNames,
    excessAccounts: excessAccountsWithNames,
    incomeOnAccounts,
    investmentIncome,
    incomeSinceLast,
    budgetStartDate,
    budgetEndDate,
    isReadyToRelease,
    amountToNeeds,
    amountToWants,
    excess: excessIncome,
    transactions,
    parentTransactions
  }
}
