import type { BudgetSavings } from '$lib/types/budgetTypes'
import { connect } from '$lib/db'

export async function newBudgetSavingsAccount (savings:  Omit<BudgetSavings, 'id'>) {
  const db = await connect()
  const res = await db.query(`
    INSERT INTO budget_savings_mapping("user", "account", "max") 
    VALUES($1, $2, $3) RETURNING id`,
    [savings.user, savings.account, savings.max])
  return res.rows[0].id
}

export async function getAllBudgetSavingsAccounts (userId: number): Promise<BudgetSavings[]> {
  const db = await connect()
  const res = await db.query(
    'SELECT * from budget_savings_mapping WHERE "user"=$1',
    [userId]
  )
  return res.rows
}

export async function updateBudgetSavingsAccount (savings: BudgetSavings) {
  const db = await connect()
  await db.query(`
    UPDATE budget_savings_mapping SET ("user", "account", "max") = ($1, $2, $3)
    WHERE id=$4`,
    [savings.user, savings.account, savings.max, savings.id])
}

export async function deleteBudgetSavingsAccount (budgetSavingsId: number, userId: number) {
  const db = await connect()
  await db.query(`
    DELETE FROM budget_savings_mapping
    WHERE id=$1 AND "user"=$2
  `, [budgetSavingsId, userId])
}
