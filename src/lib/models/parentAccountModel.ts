import { connect } from '$lib/db'
import type {
  AccountTree, AccountTypeBudget,
  AccountTypeSaving,
  DBResultAccountsWithChildren,
  ParentAccount
} from '$lib/types/accountTypes'
import { AccountType } from '$lib/types/accountTypes'


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
          target: account.target,
          completed: account.completed
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
    ats.multiplier, ats.target, ats.completed,
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