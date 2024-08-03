import FluentBox16Regular from '~icons/fluent/box-16-regular';
import MapGroceryOrSupermarket from '~icons/map/grocery-or-supermarket';
import FaSolidPiggyBank from '~icons/fa-solid/piggy-bank';
import LaHandshakeSolid from '~icons/la/handshake-solid';
import type { FrequencyCategory } from '$lib/types/sharedTypes'

export enum AccountType {
  STORAGE = 'Storage',
  BUDGET = 'Budget',
  SAVING = 'Saving',
  OWED = 'Owed'
}

export enum BudgetAccountType {
  NEED = 'Needs',
  WANT = 'Wants'
}

export type AccountTypeBudget = {
  id: number
  account: number
  regularBudget: number
  budgetMax: number
  frequency: number
  frequencyCategory: FrequencyCategory
  startDate: Date
  dayOf: number
  type: BudgetAccountType
}

export type AccountTypeSaving = {
  id: number
  account: number
  multiplier: number
  target: number
  completed?: boolean
}

export type Account = {
  id: number
  name: string
  type: AccountType
  parent: number
  additionalAccountData?: AccountTypeSaving | AccountTypeBudget
  archived?: boolean
}

export const accountTypeIcons = {
  [AccountType.STORAGE]: FluentBox16Regular,
  [AccountType.BUDGET]: MapGroceryOrSupermarket,
  [AccountType.SAVING]: FaSolidPiggyBank,
  [AccountType.OWED]: LaHandshakeSolid
}
export const accountTypeDescriptions = {
  [AccountType.STORAGE]: 'This is a generic unlimited storage source. Use it for saving for retirement, for placing money in a splurge account, or for any other tracking of your funds.',
  [AccountType.BUDGET]: 'Use this for budgeting. Create an account for tracking spending on groceries, bills or car maintenance.',
  [AccountType.SAVING]: 'Create a Savings account when you have a specific goal in mind; Saving for a book, car or house!',
  [AccountType.OWED]: 'When you loan someone money, or they loan you money, use this to track how much is left to pay, and close it when you are equal.'
}

export interface ExpandedSavingsAccount extends AccountTypeSaving {
  name: string
  type: string
  parent: number
}

export type SuggestedTransaction = {
  account: number,
  amount: number
}

export type ParentAccount = {
  id: number
  user: number
  name: string
  archived?: boolean
}

export interface AccountNode extends ParentAccount {
  children: {
    [id: number]: Account
  }
}

export interface AccountTree {
  [id: number]: AccountNode
}

export interface DBResultAccountsWithChildren extends ParentAccount {
  archived?: boolean
  accountId?: number
  accountName?: string
  accountType?: AccountType
  accountArchived?: boolean
  multiplier?: number
  target?: number
  completed?: boolean
  regularBudget?: number
  budgetMax?: number
  frequency?: number
  frequencyCategory?: FrequencyCategory
  startDate?: Date
  dayOf?: number
  savings_id?: number
  budget_id?: number
  budget_type?: string
}