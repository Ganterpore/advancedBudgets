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

/** Changes the amount (cents) and date of a previously recorded value. */
export async function updateInvestmentValue (valueId: number, userId: number, amount: number, onDate: Date): Promise<void> {
  const db = await connect()
  const res = await db.query(
    `UPDATE investment_value iv SET ("amount", "onDate") = ($1, $2)
     FROM investment_account ia
     WHERE ia.id = iv.investment AND iv.id = $3 AND ia."user" = $4`,
    [Math.round(amount), onDate, valueId, userId]
  )
  if (res.rowCount === 0) throw error(404, 'Value not found')
}

/** Removes a recorded value. An investment must always keep at least one value. */
export async function deleteInvestmentValue (valueId: number, userId: number): Promise<void> {
  const db = await connect()
  const owned = await db.query(
    `SELECT iv.investment, (SELECT COUNT(*) FROM investment_value WHERE investment = iv.investment) AS "valueCount"
     FROM investment_value iv
     JOIN investment_account ia ON ia.id = iv.investment
     WHERE iv.id = $1 AND ia."user" = $2`,
    [valueId, userId]
  )
  if (owned.rows.length === 0) throw error(404, 'Value not found')
  if (Number(owned.rows[0].valueCount) <= 1) throw error(400, 'An investment must have at least one value')
  await db.query('DELETE FROM investment_value WHERE id = $1', [valueId])
}
