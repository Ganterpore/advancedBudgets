import { connect } from '../db'
import type { SubAccount } from './subAccounts'

export type Account = {
  id: number
  user: number
  name: string
}

export interface AccountTree extends Account {
  subAccounts: SubAccount[]
}

export async function newAccount(accountInfo: Omit<Account, 'id'>): Promise<number> {
  const db = await connect()
  const res = await db.query(
    'INSERT INTO accounts("user", "name") VALUES($1, $2) RETURNING id',
    [accountInfo.user, accountInfo.name]
  )
  return res.rows[0].id
}

export async function getAccountsForUser (userId: number): Promise<AccountTree[]> {
  const db = await connect()
  const res = await db.query(
    '\
    SELECT * FROM ACCOUNTS A WHERE USER=$1\
    LEFT JOIN SUB_ACCOUNTS S\
    ON A.ID = S.PARENT',
    [userId]
  )
  console.log(res.rows)
  return res.rows
}