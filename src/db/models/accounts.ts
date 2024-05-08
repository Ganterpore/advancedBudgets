import { connect } from '../db'
import type { Account } from '../types/accounts'

export async function newAccount(account: Omit<Account, 'id'>): Promise<number> {
  const db = await connect()
  const res = await db.query('INSERT INTO accounts("name", "type", "parent") VALUES($1, $2, $3) RETURNING id',
    [account.name, account.type, account.parent])
  return res.rows[0].id
}