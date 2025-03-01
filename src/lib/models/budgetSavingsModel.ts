import type { BudgetSavings } from '$lib/types/budgetTypes'
import { connect } from '$lib/db'

export async function newBudgetSavingsAccount (savings:  Omit<BudgetSavings, 'id'>) {
  const db = await connect()
  const res = await db.query(`
    INSERT INTO budget_savings_mapping("user", "account", "max", "type") 
    VALUES($1, $2, $3, $4) RETURNING id`,
    [savings.user, savings.account, Math.round(savings.max), savings.type])
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
    UPDATE budget_savings_mapping SET ("user", "account", "max", "type") = ($1, $2, $3, $4)
    WHERE id=$5`,
    [savings.user, savings.account, Math.round(savings.max), savings.type, savings.id])
}

export async function deleteBudgetSavingsAccount (budgetSavingsId: number, userId: number) {
  const db = await connect()
  await db.query(`
    DELETE FROM budget_savings_mapping
    WHERE id=$1 AND "user"=$2
  `, [budgetSavingsId, userId])
}
