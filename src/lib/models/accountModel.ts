import { connect } from '$lib/db'
import type { Account } from '$lib/types/accountTypes'

export async function newAccount(account: Omit<Account, 'id'>): Promise<number> {
  const db = await connect()
  const res = await db.query('INSERT INTO accounts("name", "type", "parent") VALUES($1, $2, $3) RETURNING id',
    [account.name, account.type, account.parent])
  return res.rows[0].id
}

export async function getAccount (accountId: number): Promise<Account> {
  const db = await connect()
  const res = await db.query(
    'SELECT * from ACCOUNTS WHERE ID=$1',
    [accountId]
  )
  return res.rows[0]
}