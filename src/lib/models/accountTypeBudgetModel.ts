import { connect } from '$lib/db'
import type { AccountTypeBudget, ExpandedBudgetAccount } from '$lib/types/accountTypes'

export async function newBudgetAccount(props: Omit<AccountTypeBudget, 'id'>) {
  const db = await connect()
  const res = await db.query(
`INSERT INTO account_type_budget("account", "regularBudget", "budgetMax", "frequency", "frequencyCategory", "startDate", "dayOf", "type")
                VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
    [props.account, props.regularBudget, Math.round(props.budgetMax), props.frequency, props.frequencyCategory, props.startDate, props.dayOf, props.type])
  return res.rows[0].id
}

export async function updateBudgetAccount (budgetAccount: AccountTypeBudget): Promise<void> {
  const db = await connect()
  await db.query(
    `UPDATE account_type_budget SET 
        ("account", "regularBudget", "budgetMax", "frequency", "frequencyCategory", "startDate", "dayOf", "type") 
        = ($1, $2, $3, $4, $5, $6, $7, $8)
        WHERE ID=$9`,
    [
      budgetAccount.account,
      budgetAccount.regularBudget,
      budgetAccount.budgetMax,
      budgetAccount.frequency,
      budgetAccount.frequencyCategory,
      budgetAccount.startDate,
      budgetAccount.dayOf,
      budgetAccount.type,
      budgetAccount.id
    ])
}

export async function getAllBudgetAccountsForUser (userId: number): Promise<ExpandedBudgetAccount[]> {
  const db = await connect()
  const res = await db.query(
    `
    SELECT b.*, S.name, S.parent
    FROM ACCOUNTS S 
    inner join account_type_budget b on b.account=S.id
    inner join parent_accounts pa on S.parent=pa.id
    WHERE pa."user"=$1 AND S.archived is not true`,
    [userId]
  )
  return res.rows
}
