import type { ParentAccountTotals, Transaction, TransactionWithParent } from './types'
import { connect } from '$lib/db'

export async function newTransaction (transaction: Omit<Transaction, 'id'|'transactionTime'>) {
  const db = await connect()
  const res = await db.query(
    'INSERT INTO transactions("amount", "description", "account", "transactionTime") VALUES($1, $2, $3, $4) RETURNING id',
    [transaction.amount, transaction.description, transaction.account, new Date()])
  return res.rows[0].id
}

function buildTotalsTree (rows: { account: number, parent: number, value: number}[]) {
  const getOrCreateBranch = (tree: ParentAccountTotals, branch: number) => {
    if (!tree[branch]) {
      tree[branch] = {
        value: 0,
        children: {}
      }
    }
    return tree[branch]
  }

  const totals: ParentAccountTotals = {}
  for (const row of rows) {
    const parent = getOrCreateBranch(totals, row.parent)
    parent.value += Number(row.value)
    parent.children[row.account] = Number(row.value)
  }
  return totals
}

export async function getAccountTotalsForUser (userId: number) {
  const db = await connect()
  const res = await db.query(
    'select t.account, a.parent , sum(amount) as value from transactions t\
        inner join accounts a\
        on t.account = a.id \
        where a.parent in (\
          select id from parent_accounts\
          where "user"=$1\
        )\
        group by t.account, a.parent',
    [userId]
  )

  return buildTotalsTree(res.rows)
}

export async function getTransactionsOnAccount (accountId: number): Promise<TransactionWithParent[]> {
  const db = await connect()
  const res = await db.query(
    `select t.id, amount, description, account, a.name as "accountName" 
                    from transactions t
                     join accounts a on account=a.id 
                     WHERE account=$1`,
    [accountId]
  )
  return res.rows
}
export async function getTransactionsOnParentAccount (accountId: number): Promise<TransactionWithParent[]> {
  const db = await connect()
  const res = await db.query(
    `select t.id, amount, description, account, a.name as "accountName" 
                    from transactions t
                    join accounts a on account=a.id
                    where a.parent=$1`,
    [accountId]
  )
  return res.rows
}