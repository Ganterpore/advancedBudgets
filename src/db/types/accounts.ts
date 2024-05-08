import type { AccountTypeSaving } from '../models/accountTypeSaving'
import type { AccountTypeBudget } from './accountTypeBudget'

export enum AccountTypes {
  BUDGET = 'Budget',
  SAVING = 'Saving',
  STORAGE = 'Storage',
  OWING = 'Owing'
}

export type Account = {
  id: number
  name: string
  type: AccountTypes
  parent: number
  additionalAccountData?: Partial<AccountTypeSaving> | Partial<AccountTypeBudget>
}