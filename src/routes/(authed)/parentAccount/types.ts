import type {Account} from "../account/types";
import {AccountType} from '../account/types'
import { FrequencyCategory } from "$lib/types";

export type ParentAccount = {
    id: number
    user: number
    name: string
}

export interface AccountNode extends Omit<ParentAccount, 'user'> {
    children: {
        [id: number]: Omit<Account, 'parent'>
    }
}

export interface AccountTree {
    [id: number]: AccountNode
}

export interface DBResultAccountsWithChildren extends Omit<ParentAccount, 'user'> {
    accountId?: number
    accountName?: string
    accountType?: AccountType
    multiplier?: number
    target?: number
    regularBudget?: number
    budgetMax?: number
    frequency?: number
    frequencyCategory?: FrequencyCategory
    startDate?: Date
    dayOf?: number
}