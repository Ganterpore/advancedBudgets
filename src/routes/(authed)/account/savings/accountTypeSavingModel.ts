import type { AccountTypeSaving, ExpandedSavingsAccount } from './types'
import { connect } from '$lib/db'


export async function newSavingsAccount(props: Omit<AccountTypeSaving, 'id'>) {
  const db = await connect()
  const res = await db.query('INSERT INTO account_type_saving("account", "multiplier", "target") VALUES($1, $2, $3) RETURNING id',
    [props.account, props.multiplier, props.target])
  return res.rows[0].id
}

export async function getSavingsAccountsOnParent (parentId: number): Promise<ExpandedSavingsAccount[]> {
  const db = await connect()
  const res = await db.query(
    `
    SELECT ats.id, ats.account, S.name, S.type, ats.multiplier, ats.target, S.parent
    FROM ACCOUNTS S 
    inner join account_type_saving ats
    on ats.account=S.id
    WHERE S.parent=$1`,
    [parentId]
  )
  return res.rows as ExpandedSavingsAccount[]
}

export async function getSavingsAccountOnAccountId (accountId: number): Promise<AccountTypeSaving> {
  const db = await connect()
  const res = await db.query(`SELECT * FROM ACCOUNT_TYPE_SAVING WHERE ACCOUNT=$1`, [accountId])
  return res.rows[0]
}