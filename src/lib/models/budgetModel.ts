import type { Budget } from '$lib/types/budgetTypes'
import { connect } from '$lib/db'

export async function newBudget (budget: Omit<Budget, 'id'>) {
  const db = await connect()
  const res = await db.query(`
    INSERT INTO budget("user", "frequency", "frequencyCategory", "dayOf", "lastBudget") 
    VALUES($1, $2, $3, $4, $5) RETURNING id`,
    [budget.user, budget.frequency, budget.frequencyCategory, budget.dayOf, budget.lastBudget])
  return res.rows[0].id
}

export async function getBudgetForUser (userId: number): Promise<Budget | undefined> {
  const db = await connect()
  const res = await db.query(
    'SELECT * from budget WHERE "user"=$1',
    [userId]
  )
  return res.rows[0]
}

export async function updateBudget (budget: Budget) {
  const db = await connect()
  await db.query(`
    UPDATE budget SET ("user", "frequency", "frequencyCategory", "dayOf", "lastBudget") = ($1, $2, $3, $4, $5) 
    WHERE ID=$6`,
    [budget.user, budget.frequency, budget.frequencyCategory, budget.dayOf, budget.lastBudget, budget.id])
}
