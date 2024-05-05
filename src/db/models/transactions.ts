import { connect } from '../db'

export type Transaction = {
  id: number,
  amount: number,
  description: string,
  account: number
}

export async function newTransaction (transaction: Omit<Transaction, 'id'>) {
  const db = await connect()
  const res = await db.query(
    'INSERT INTO transactions("amount", "description", "account") VALUES($1, $2, $3) RETURNING id',
    [transaction.amount, transaction.description, transaction.account])
  return res.rows[0].id
}

export async function getTransactionsOnAccount (accountId: number) {
  const db = await connect()
  const res = await db.query(
    'SELECT * FROM transactions WHERE account=$1',
    [accountId]
  )
  return res.rows
}