import FluentBox16Regular from '~icons/fluent/box-16-regular';
import MapGroceryOrSupermarket from '~icons/map/grocery-or-supermarket';
import FaSolidPiggyBank from '~icons/fa-solid/piggy-bank';
import LaHandshakeSolid from '~icons/la/handshake-solid';
import type { AccountTypeSaving } from "./savings/types";
import type { AccountTypeBudget } from "./budget/types";

export enum AccountType {
  STORAGE = 'Storage',
  BUDGET = 'Budget',
  SAVING = 'Saving',
  OWED = 'Owed'
}

export type Account = {
  id: number
  name: string
  type: AccountType
  parent: number
  additionalAccountData?: Partial<AccountTypeSaving> | Partial<AccountTypeBudget>
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