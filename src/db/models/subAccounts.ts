import { connect } from '../db'

export enum SubAccountTypes {
  BUDGET = 'Budget',
  SAVING = 'Saving',
  STORAGE = 'Storage',
  OWING = 'Owing'
}

export type SubAccount = {
  id: number
  name: string
  type: SubAccountTypes
  parent: number
}

export async function newSubAccount(subAccount: Omit<SubAccount, 'id'>) {
  const db = await connect()
  const res = await db.query('INSERT INTO sub_accounts("name", "type", "parent") VALUES($1, $2, $3) RETURNING id',
    [subAccount.name, subAccount.type, subAccount.parent])
  return res.rows[0].id
}