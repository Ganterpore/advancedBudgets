import { connect } from '../db'

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
}

export async function newAccount(account: Omit<Account, 'id'>) {
  const db = await connect()
  const res = await db.query('INSERT INTO accounts("name", "type", "parent") VALUES($1, $2, $3) RETURNING id',
    [account.name, account.type, account.parent])
  return res.rows[0].id
}