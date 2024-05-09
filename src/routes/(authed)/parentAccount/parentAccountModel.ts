import type { AccountsWithChildren, AccountTree, ParentAccount } from './types'
import { connect } from '$lib/db'


export async function newParentAccount(accountInfo: Omit<ParentAccount, 'id'>): Promise<number> {
  const db = await connect()
  const res = await db.query(
    'INSERT INTO PARENT_ACCOUNTS("user", "name") VALUES($1, $2) RETURNING id',
    [accountInfo.user, accountInfo.name]
  )
  return res.rows[0].id
}

function buildAccountTree (accounts: AccountsWithChildren[]): AccountTree {
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
    }
  }
  return accountTree
}

export async function getAccountsForUser (userId: number): Promise<AccountTree> {
  const db = await connect()
  const res = await db.query(
    `SELECT A.id, A.name, S.id as "accountId", S.name as "accountName", S.type as "accountType"
    FROM PARENT_ACCOUNTS A
    LEFT JOIN ACCOUNTS S
    ON A.ID = S.PARENT
    WHERE A.USER=$1`,
    [userId]
  )
  return buildAccountTree(res.rows)
}