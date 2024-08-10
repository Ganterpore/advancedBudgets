import type { BudgetExcess } from '$lib/types/budgetTypes'
import { connect } from '$lib/db'

export async function newExcessAccount (excess:  Omit<BudgetExcess, 'id'>) {
  const db = await connect()
  const res = await db.query(`
    INSERT INTO budget_excess_mapping("user", "account", "proportion") 
    VALUES($1, $2, $3) RETURNING id`,
    [excess.user, excess.account, excess.proportion])
  return res.rows[0].id
}

export async function getAllExcessAccounts (userId: number): Promise<BudgetExcess[]> {
  const db = await connect()
  const res = await db.query(
    'SELECT * from budget_excess_mapping WHERE "user"=$1',
    [userId]
  )
  return res.rows
}

export async function updateExcessAccount (excess: BudgetExcess) {
  const db = await connect()
  await db.query(`
    UPDATE budget_excess_mapping SET ("user", "account", "proportion") = ($1, $2, $3)
    WHERE id=$4`,
    [excess.user, excess.account, excess.proportion, excess.id])
}

export async function deleteExcessAccount (excessId: number, userId: number) {
  const db = await connect()
  await db.query(`
    DELETE FROM budget_excess_mapping
    WHERE id=$1 AND "user"=$2
  `, [excessId, userId])
}
