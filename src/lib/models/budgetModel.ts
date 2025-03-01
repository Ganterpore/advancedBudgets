import type { Budget } from '$lib/types/budgetTypes'
import { connect } from '$lib/db'
import { FrequencyCategory } from '$lib/types/sharedTypes'

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

export async function getOrCreateBudgetForUser (userId: number): Promise<Budget> {
  let budget: Budget | undefined = await getBudgetForUser(userId)
  if (!budget) {
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    const defaultBudget = {
      user: userId,
      frequency: 1,
      frequencyCategory: FrequencyCategory.MONTHLY,
      dayOf: 15,
      lastBudget: oneMonthAgo
    }
    const id = await newBudget(defaultBudget)
    budget = {
      ...defaultBudget,
      id
    }
  }
  return budget
}

export async function updateBudget (budget: Budget) {
  const db = await connect()
  await db.query(`
    UPDATE budget SET ("user", "frequency", "frequencyCategory", "dayOf", "lastBudget") = ($1, $2, $3, $4, $5) 
    WHERE ID=$6`,
    [budget.user, budget.frequency, budget.frequencyCategory, budget.dayOf, budget.lastBudget, budget.id])
}
