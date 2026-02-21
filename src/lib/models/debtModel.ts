import type { Debt, ParentAccount } from '$lib/types/accountTypes'
import { newParentAccount, updateParentAccount, archiveParentAccount } from '$lib/models/parentAccountModel'
import { connect } from '$lib/db'
import { newAccount } from '$lib/models/accountModel'
import { AccountType } from '$lib/types/accountTypes'
import type { Account } from '$lib/types/accountTypes'

export async function newDebt(debtInfo: Omit<Debt, 'id' | 'parent'|'nominatedAccount'>): Promise<number> {
  const parentObject: Omit<ParentAccount, 'id'> = {
    user: debtInfo.user,
    name: debtInfo.name,
    archived: false
  }
  const parentId = await newParentAccount(parentObject)
  const accountObject: Omit<Account, 'id'> = {
    name: 'Principal Repayments',
    type: AccountType.STORAGE,
    parent: parentId,
    archived: false
  }
  const nominatedAccount = await newAccount(accountObject)
  const db = await connect()
  const res = await db.query(
    `INSERT INTO DEBT_ACCOUNT("parent", "principal", "percent", "regularRepayment", "nominatedAccount")
    VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [parentId, debtInfo.principal, debtInfo.percent, debtInfo.regularRepayment, nominatedAccount]
  )
  return res.rows[0].id
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