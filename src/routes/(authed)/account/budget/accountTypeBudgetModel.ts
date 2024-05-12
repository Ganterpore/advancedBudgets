import type { AccountTypeBudget } from './types'
import { connect } from '$lib/db'

export async function newBudgetAccount(props: Omit<AccountTypeBudget, 'id'>) {
  const db = await connect()
  const res = await db.query(
`INSERT INTO account_type_budget("account", "regularBudget", "budgetMax", "frequency", "frequencyCategory", "startDate", "dayOf") 
                VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [props.account, props.regularBudget, props.budgetMax, props.frequency, props.frequencyCategory, props.startDate, props.dayOf])
  return res.rows[0].id
}