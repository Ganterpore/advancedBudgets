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

export type AccountTotals = {
    [key: number]: {
        value: number
        children: {
            [key: number]: number
        }
    }
}