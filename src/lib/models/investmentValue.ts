import type { InvestmentValue } from '$lib/types/accountTypes'
import { connect } from '$lib/db'
import { error } from '@sveltejs/kit'

async function assertInvestmentOwner (investmentId: number, userId: number): Promise<void> {
  const db = await connect()
  const res = await db.query(
    'SELECT id FROM investment_account WHERE id = $1 AND "user" = $2',
    [investmentId, userId]
  )
  if (res.rows.length === 0) throw error(404, 'Investment not found')
}

/** All recorded values for an investment, newest first. */
export async function getInvestmentValues (investmentId: number, userId: number): Promise<InvestmentValue[]> {
  await assertInvestmentOwner(investmentId, userId)
  const db = await connect()
  const res = await db.query(
    `SELECT id, investment, amount, "onDate" FROM investment_value
     WHERE investment = $1
     ORDER BY "onDate" DESC, id DESC`,
    [investmentId]
  )
  return res.rows
}

/** Records a new current value for an investment (amount in cents). */
export async function addInvestmentValue (investmentId: number, userId: number, amount: number): Promise<void> {
  await assertInvestmentOwner(investmentId, userId)
  const db = await connect()
  await db.query(
    `INSERT INTO investment_value("investment", "amount", "onDate")
     VALUES($1, $2, $3)`,
    [investmentId, Math.round(amount), new Date()]
  )
}
