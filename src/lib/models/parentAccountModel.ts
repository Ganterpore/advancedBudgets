import { connect } from '$lib/db'
import type {
  AccountTree, AccountTypeBudget,
  AccountTypeSaving,
  DBResultAccountsWithChildren,
  ParentAccount
} from '$lib/types/accountTypes'
import { AccountType } from '$lib/types/accountTypes'
import { getTotalsOnParentAccount } from '$lib/models/transactionModel'
import { error } from '@sveltejs/kit'


export async function newParentAccount(accountInfo: Omit<ParentAccount, 'id'>): Promise<number> {
  const db = await connect()
  const res = await db.query(
    'INSERT INTO PARENT_ACCOUNTS("user", "name") VALUES($1, $2) RETURNING id',
    [accountInfo.user, accountInfo.name]
  )
  return res.rows[0].id
}

export async function getParentAccount (accountId: number): Promise<ParentAccount> {
  const db = await connect()
  const res = await db.query(
    `SELECT * FROM PARENT_ACCOUNTS WHERE ID=$1`,
    [accountId]
  )
  return res.rows[0]
}

export async function updateParentAccount(accountInfo: ParentAccount): Promise<void> {
  const db = await connect()
  await db.query(
    'UPDATE PARENT_ACCOUNTS SET ("user", "name") = ($1, $2) WHERE ID=$3',
    [accountInfo.user, accountInfo.name, accountInfo.id]
  )
}

export async function archiveParentAccount (accountId: number): Promise<void> {
  const total = await getTotalsOnParentAccount(accountId)
  if (total !== 0) throw error(400, 'Cannot archive account unless the total is zero')
  const db = await connect()
  await db.query(
    `UPDATE PARENT_ACCOUNTS SET "archived" = true
      WHERE ID=$1`,
    [accountId]
  )
}

function buildAccountTree (accounts: DBResultAccountsWithChildren[]): AccountTree {
  const accountTree: AccountTree = {}
  for (const account of accounts) {
    if (!accountTree[account.id]) accountTree[account.id] = {
      id: account.id,
      name: account.name,
      user: account.user,
      archived: account.archived,
      children: {}
    }
    const parentAccount = accountTree[account.id]
    if (account.debt_id && !parentAccount.debtInfo) {
      parentAccount.debtInfo = {
        id: account.debt_id,
        nominatedAccount: account.nominatedAccount!,
        principal: account.principal!,
        percent: account.percent!,
        regularRepayment: account.regularRepayment!
      }
    }

    if (account.accountId) {
      parentAccount.children[account.accountId] = {
        id: account.accountId,
        name: account.accountName!,
        type: account.accountType!,
        archived: account.accountArchived,
        parent: account.id
      }
      if (account.accountType === AccountType.SAVING) {
        parentAccount.children[account.accountId].additionalAccountData = {
          multiplier: account.multiplier,
          target: account.target,
          completed: account.completed,
          id: account.savings_id!
        } as AccountTypeSaving
      }
      if (account.accountType === AccountType.BUDGET || account.accountType === AccountType.PLANNED) {
        parentAccount.children[account.accountId].additionalAccountData = {
          regularBudget: account.regularBudget,
          budgetMax: account.budgetMax,
          frequency: account.frequency,
          frequencyCategory: account.frequencyCategory,
          startDate: account.startDate,
          endDate: account.endDate,
          dayOf: account.dayOf,
          id: account.budget_id!,
          type: account.budget_type!
        } as AccountTypeBudget
      }
    }
  }
  return accountTree
}

export async function getAccountsForUser (userId: number): Promise<AccountTree> {
  const db = await connect()
  const res = await db.query(
    `
    SELECT A.id, A.name, A.user, A.archived,
    S.id as "accountId", S.name as "accountName", S.type as "accountType", S.archived as "accountArchived",
    ats.multiplier, ats.target, ats.completed, ats.id as savings_id,
    atb."regularBudget", atb."budgetMax", atb.frequency, atb."frequencyCategory", atb."dayOf", atb."startDate", atb."endDate", atb."id" as budget_id, atb."type" as budget_type,
    d.id as debt_id, d.principal, d.percent, d."regularRepayment", d."nominatedAccount"
    FROM PARENT_ACCOUNTS A
    LEFT JOIN ACCOUNTS S 
    ON A.ID = S.PARENT
    left join account_type_saving ats
    on ats.account=S.id
    left join account_type_budget atb
    on atb.account=S.id
    LEFT JOIN DEBT_ACCOUNT d
    ON d.parent = A.id
    WHERE A.USER=$1`,
    [userId]
  )
  return buildAccountTree(res.rows)
}