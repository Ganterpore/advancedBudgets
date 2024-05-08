import { connect } from '../db'
import type { AccountTypeBudget } from '../types/accountTypeBudget'

export async function newBudgetAccount(props: Omit<AccountTypeBudget, 'id'>) {
  const db = await connect()
  const res = await db.query(
`INSERT INTO account_type_budget("account", "regularBudget", "budgetMax", "frequency", "frequencyCategory", "startDate") 
                VALUES($1, $2, $3, $4, $5, $6) RETURNING id`,
    [props.account, props.regularBudget, props.budgetMax, props.frequency, props.frequencyCategory, props.startDate])
  return res.rows[0].id
}