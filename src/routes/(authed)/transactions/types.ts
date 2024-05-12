export enum TransactionType {
    UNSELECTED = 'unselected',
    INDIVIDUAL = 'individual',
    GROUPED_SAVING = 'group_savings'
}

export type Transaction = {
    id: number,
    amount: number,
    description: string,
    account: number,
    transactionTime: Date
}

export interface TransactionWithParent extends Transaction {
    accountName: string
}

export type ParentAccountTotals = {
    [parentAccountId: number]: {
        value: number
        children: AccountTotals
    }
}

export type AccountTotals = {
    [accountId: number]: number
}