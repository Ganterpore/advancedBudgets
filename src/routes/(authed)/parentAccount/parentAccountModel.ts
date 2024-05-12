import type { AccountTree, DBResultAccountsWithChildren, ParentAccount } from './types'
import { connect } from '$lib/db'
import { AccountType } from "../account/types";
import type { AccountTypeSaving } from "../account/savings/types";
import type { AccountTypeBudget } from "../account/budget/types";


export async function newParentAccount(accountInfo: Omit<ParentAccount, 'id'>): Promise<number> {
  const db = await connect()
  const res = await db.query(
    'INSERT INTO PARENT_ACCOUNTS("user", "name") VALUES($1, $2) RETURNING id',
    [accountInfo.user, accountInfo.name]
  )
  return res.rows[0].id
}

function buildAccountTree (accounts: DBResultAccountsWithChildren[]): AccountTree {
  const accountTree: AccountTree = {}
  for (const account of accounts) {
    if (!accountTree[account.id]) accountTree[account.id] = {
      id: account.id,
      name: account.name,
      children: {}
    }
    const parentAccount = accountTree[account.id]
    if (account.accountId) {
      parentAccount.children[account.accountId!] = {
        id: account.accountId!,
        name: account.accountName!,
        type: account.accountType!
      }
      if (account.accountType === AccountType.SAVING) {
        parentAccount.children[account.accountId!].additionalAccountData = {
          multiplier: account.multiplier,
          target: account.target
        } as Partial<AccountTypeSaving>
      }
      if (account.accountType === AccountType.BUDGET) {
        parentAccount.children[account.accountId!].additionalAccountData = {
          regularBudget: account.regularBudget,
          budgetMax: account.budgetMax,
          frequency: account.frequency,
          frequencyCategory: account.frequencyCategory,
          startDate: account.startDate,
          dayOf: account.dayOf,
        } as Partial<AccountTypeBudget>
      }
    }
  }
  return accountTree
}

export async function getAccountsForUser (userId: number): Promise<AccountTree> {
  const db = await connect()
  const res = await db.query(
    `
    SELECT A.id, A.name, S.id as "accountId", S.name as "accountName", S.type as "accountType",
    ats.multiplier, ats.target,
    atb."regularBudget", atb."budgetMax", atb.frequency, atb."frequencyCategory", atb."dayOf", atb."startDate"
    FROM PARENT_ACCOUNTS A
    LEFT JOIN ACCOUNTS S 
    ON A.ID = S.PARENT
    left join account_type_saving ats
    on ats.account=S.id
    left join account_type_budget atb
    on atb.account=s.id
    WHERE A.USER=$1`,
    [userId]
  )
  return buildAccountTree(res.rows)
}