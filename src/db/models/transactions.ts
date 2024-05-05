import { connect } from '../db'

export type Transaction = {
  id: number,
  amount: number,
  description: string,
  account: number
}

export type AccountTotals = {
  [key: number]: {
    value: number
    children: {
      [key: number]: number
    }
  }
}

export async function newTransaction (transaction: Omit<Transaction, 'id'>) {
  const db = await connect()
  const res = await db.query(
    'INSERT INTO transactions("amount", "description", "account") VALUES($1, $2, $3) RETURNING id',
    [transaction.amount, transaction.description, transaction.account])
  return res.rows[0].id
}

function buildTotalsTree (rows: { account: number, parent: number, value: number}[]) {
  const getOrCreateBranch = (tree: AccountTotals, branch: number) => {
    if (!tree[branch]) {
      tree[branch] = {
        value: 0,
        children: {}
      }
    }
    return tree[branch]
  }

  const totals: AccountTotals = {}
  for (const row of rows) {
    const parent = getOrCreateBranch(totals, row.parent)
    parent.value += row.value
    parent.children[row.account] = row.value
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

export async function getTransactionsOnAccount (accountId: number) {
  const db = await connect()
  const res = await db.query(
    'SELECT * FROM transactions WHERE account=$1',
    [accountId]
  )
  return res.rows
}