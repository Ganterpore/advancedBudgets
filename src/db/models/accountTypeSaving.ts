import { connect } from '../db'

export type AccountTypeSaving = {
  id: number
  account: number
  multiplier: number
  target: number
}

export async function newSavingsAccount(props: Omit<AccountTypeSaving, 'id'>) {
  const db = await connect()
  const res = await db.query('INSERT INTO account_type_saving("account", "multiplier", "target") VALUES($1, $2, $3) RETURNING id',
    [props.account, props.multiplier, props.target])
  return res.rows[0].id
}