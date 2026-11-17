import type { Debt, ParentAccount } from '$lib/types/accountTypes'
import { newParentAccount, updateParentAccount, archiveParentAccount, getParentAccount } from '$lib/models/parentAccountModel'
import { connect } from '$lib/db'
import { getAccount, newAccount } from '$lib/models/accountModel'
import { error } from '@sveltejs/kit'
import { AccountType } from '$lib/types/accountTypes'
import type { Account } from '$lib/types/accountTypes'

async function insertDebtRow(
  parentId: number,
  debtInfo: Pick<Debt, 'principal' | 'percent' | 'regularRepayment'>,
  nominatedAccount?: number
): Promise<number> {
  if (!nominatedAccount) {
    const accountObject: Omit<Account, 'id'> = {
      name: 'Principal Repayments',
      type: AccountType.STORAGE,
      parent: parentId,
      archived: false
    }
    nominatedAccount = await newAccount(accountObject)
  }
  const db = await connect()
  const res = await db.query(
    `INSERT INTO DEBT_ACCOUNT("parent", "principal", "percent", "regularRepayment", "nominatedAccount")
    VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [parentId, debtInfo.principal, debtInfo.percent, debtInfo.regularRepayment, nominatedAccount]
  )
  return res.rows[0].id
}

export async function newDebt(debtInfo: Omit<Debt, 'id' | 'parent'|'nominatedAccount'>): Promise<number> {
  const parentObject: Omit<ParentAccount, 'id'> = {
    user: debtInfo.user,
    name: debtInfo.name,
    archived: false
  }
  const parentId = await newParentAccount(parentObject)
  return insertDebtRow(parentId, debtInfo)
}

/**
 * Turns an existing (cash) parent account into a debt account.
 * If no nominated account is given, a new 'Principal Repayments' storage account is created under the parent.
 */
export async function convertParentToDebt(
  debtInfo: Omit<Debt, 'id' | 'nominatedAccount'>,
  nominatedAccount?: number
): Promise<number> {
  const parent = await getParentAccount(debtInfo.parent)
  if (!parent || Number(parent.user) !== debtInfo.user) throw error(404, 'Account not found')
  const db = await connect()
  const existing = await db.query('SELECT id FROM DEBT_ACCOUNT WHERE parent = $1', [debtInfo.parent])
  if (existing.rows.length > 0) throw error(400, 'Account is already a debt account')
  if (nominatedAccount) {
    const account = await getAccount(nominatedAccount)
    if (!account || account.parent !== debtInfo.parent || account.archived) {
      throw error(400, 'Repayment account must be an active account within this parent account')
    }
  }
  await updateParentAccount({ id: debtInfo.parent, user: debtInfo.user, name: debtInfo.name })
  return insertDebtRow(debtInfo.parent, debtInfo, nominatedAccount)
}

/**
 * Turns a debt account back into a normal (cash) parent account.
 * The parent and its child accounts (including the nominated repayment account) are kept; only the debt details are removed.
 */
export async function convertDebtToParent(parentId: number, userId: number): Promise<void> {
  const db = await connect()
  await db.query(
    `DELETE FROM DEBT_ACCOUNT d
     USING PARENT_ACCOUNTS p
     WHERE p.id = d.parent AND d.parent = $1 AND p.user = $2`,
    [parentId, userId]
  )
}

export async function getDebt(debtId: number): Promise<Debt> {
  const db = await connect()
  const res = await db.query(
    `SELECT d.id, d.parent, d.principal, d.percent, d."regularRepayment",
            p.user, p.name, p.archived
     FROM DEBT_ACCOUNT d
     JOIN PARENT_ACCOUNTS p ON p.id = d.parent
     WHERE d.id = $1`,
    [debtId]
  )
  return res.rows[0]
}

export async function getDebtsForUser(userId: number): Promise<Debt[]> {
  const db = await connect()
  const res = await db.query(
    `SELECT d.id, d.parent, d.principal, d.percent, d."regularRepayment",
            p.user, p.name, p.archived
     FROM DEBT_ACCOUNT d
     JOIN PARENT_ACCOUNTS p ON p.id = d.parent
     WHERE p.user = $1
     AND (p.archived <> true OR p.archived is null)`,
    [userId]
  )
  return res.rows.map(r => ({ ...r, percent: Number(r.percent) }))
}

export async function updateDebt(debtInfo: Debt): Promise<void> {
  await updateParentAccount({
    id: debtInfo.parent,
    user: debtInfo.user,
    name: debtInfo.name
  })
  const db = await connect()
  await db.query(
    `UPDATE DEBT_ACCOUNT SET ("principal", "percent", "regularRepayment", "nominatedAccount") = ($1, $2, $3, $4)
     WHERE id = $5`,
    [debtInfo.principal, debtInfo.percent, debtInfo.regularRepayment, debtInfo.nominatedAccount, debtInfo.id]
  )
}

export async function archiveDebt(debtId: number): Promise<void> {
  const debt = await getDebt(debtId)
  await archiveParentAccount(debt.parent)
}