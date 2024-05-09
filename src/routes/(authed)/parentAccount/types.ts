import type {Account} from "../account/types";
import {AccountType} from '../account/types'

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

export interface AccountsWithChildren extends Omit<ParentAccount, 'user'> {
    accountId?: number
    accountName?: string
    accountType?: AccountType
}