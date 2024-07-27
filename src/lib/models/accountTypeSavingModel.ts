import { connect } from '$lib/db'
import type { AccountTypeSaving, ExpandedSavingsAccount } from '$lib/types/accountTypes'
import { getTotalOnAccount } from '$lib/types/transactionModel'
import { error } from '@sveltejs/kit'

export async function newSavingsAccount(props: Omit<AccountTypeSaving, 'id'>) {
  const db = await connect()
  const res = await db.query('INSERT INTO account_type_saving("account", "multiplier", "target", "completed") VALUES($1, $2, $3, $4) RETURNING id',
    [props.account, props.multiplier, props.target, props.completed ?? false])
  return res.rows[0].id
}

export async function getSavingsAccountsOnParent (parentId: number): Promise<ExpandedSavingsAccount[]> {
  const db = await connect()
  const res = await db.query(
    `
    SELECT ats.id, ats.account, S.name, S.type, ats.multiplier, ats.target, S.parent, ats.completed
    FROM ACCOUNTS S 
    inner join account_type_saving ats
    on ats.account=S.id
    WHERE S.parent=$1 AND not ats.completed`,
    [parentId]
  )
  return res.rows as ExpandedSavingsAccount[]
}

export async function getSavingsAccountOnAccountId (accountId: number): Promise<AccountTypeSaving> {
  const db = await connect()
  const res = await db.query(`SELECT * FROM ACCOUNT_TYPE_SAVING WHERE ACCOUNT=$1`, [accountId])
  return res.rows[0]
}

export async function completeAccount (id: number) {
 const db = await connect()
  await db.query(`
    update account_type_saving 
    set "completed"=true
    where id=$1
  `, [id])
}

export async function updateSavingsAccount (props: AccountTypeSaving): Promise<void> {
  const total = await getTotalOnAccount(props.id)
  if (total > props.target) {
    throw error(400, 'Cannot reduce the target to lower than the current value')
  }
  const db = await connect()
  await db.query(`UPDATE account_type_saving SET ("account", "multiplier", "target", "completed") = ($1, $2, $3, $4) WHERE ID=$5`,
    [props.account, props.multiplier, props.target, props.completed ?? false, props.id])
}