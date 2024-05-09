import type { AccountTypeSaving } from './types'
import { connect } from '$lib/db'


export async function newSavingsAccount(props: Omit<AccountTypeSaving, 'id'>) {
  const db = await connect()
  const res = await db.query('INSERT INTO account_type_saving("account", "multiplier", "target") VALUES($1, $2, $3) RETURNING id',
    [props.account, props.multiplier, props.target])
  return res.rows[0].id
}