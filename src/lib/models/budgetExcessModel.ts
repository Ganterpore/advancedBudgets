import type { BudgetExcess } from '$lib/types/budgetTypes'
import { connect } from '$lib/db'

export async function newExcessAccount (excess:  Omit<BudgetExcess, 'id'>) {
  const db = await connect()
  const res = await db.query(`
    INSERT INTO budget_excess_mapping("user", "account", "proportion", "type") 
    VALUES($1, $2, $3, $4) RETURNING id`,
    [excess.user, excess.account, excess.proportion, excess.type])
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
    UPDATE budget_excess_mapping SET ("user", "account", "proportion", "type") = ($1, $2, $3, $4)
    WHERE id=$5`,
    [excess.user, excess.account, excess.proportion, excess.type, excess.id])
}

export async function deleteExcessAccount (excessId: number, userId: number) {
  const db = await connect()
  await db.query(`
    DELETE FROM budget_excess_mapping
    WHERE id=$1 AND "user"=$2
  `, [excessId, userId])
}
