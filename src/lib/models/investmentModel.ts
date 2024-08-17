import type { Investment, InvestmentValue } from '$lib/types/accountTypes'
import { connect } from '$lib/db'

export async function createInvestmentAccount (investment: Omit<Investment, 'id'>): Promise<number> {
  const db = await connect()
  const res = await db.query(`
    INSERT INTO investment_account("user", "name", "expectedROI", "withdrawalRate")
     VALUES($1, $2, $3, $4) RETURNING id`,
    [investment.user, investment.name, investment.expectedROI, investment.withdrawalRate])
  const accountId = res.rows[0].id
  await db.query(`
    INSERT INTO investment_value("investment", "amount", "onDate")
    VALUES($1, $2, $3)
  `, [accountId, investment.amount, new Date()])
  return Number(accountId)
}

export async function getInvestmentAccount (investmentId: number): Promise<Investment> {
  const db = await connect()
  const res = await db.query(`
    SELECT * FROM investment_account
     WHERE ID=$1`,
    [investmentId])
  const account = res.rows[0]
  const investmentValue = await db.query(`
    SELECT * FROM investment_value iv
    INNER JOIN 
      (SELECT investment, MAX(onDate) AS latestDate
       FROM investment_value
       GROUP BY investment
      ) latest ON iv.investment = latest.investment AND iv.onDate = latest.latestDate
    WHERE investment=$1
  `, [investmentId])
  account.amount = investmentValue.rows[0].amount
  return account as Investment
}

export async function getInvestmentsOnUser (userId: number): Promise<Investment[]> {
  const db = await connect()
  const res = await db.query(`
    SELECT * FROM investment_account
     WHERE "user"=$1`,
    [userId])
  const accounts: Omit<Investment, 'amount'>[] = res.rows
  const accountIds = accounts.map(acc => acc.id)
  if (accountIds.length === 0) {
    return []
  }
  const valueResults = await db.query(`
    SELECT * FROM investment_value iv
    INNER JOIN 
      (SELECT investment, MAX("onDate") AS "latestDate"
       FROM investment_value
       GROUP BY investment
      ) latest ON iv.investment = latest.investment AND iv."onDate" = latest."latestDate"
    WHERE iv.investment = ANY ($1)
  `, [accountIds])
  const investmentValues: InvestmentValue[] = valueResults.rows
  return accounts.map(acc => {
    const amount = investmentValues.find(inv => inv.investment === acc.id)
    return {
      ...acc,
      amount: amount?.amount ?? 0
    }
  })
}

export async function updateInvestmentAccount (investment: Investment): Promise<void> {
  const db = await connect()
  await db.query(`
    UPDATE investment_account
     SET ("user", "name", "expectedROI", "withdrawalRate") = ($1, $2, $3, $4) 
     WHERE ID=$5`,
    [investment.user, investment.name, investment.expectedROI, investment.withdrawalRate, investment.id])
  await db.query(`
    INSERT INTO investment_value("investment", "amount", "onDate")
    VALUES($1, $2, $3)
  `, [investment.id, investment.amount, new Date()])
}

export async function archiveInvestmentAccount (investmentId: number) {
  const db = await connect()
  await db.query(
    `UPDATE investment_account SET "archived" = true
      WHERE ID=$1`,
    [investmentId]
  )
}
