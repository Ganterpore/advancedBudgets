import { connect } from '$lib/db'
import type { User } from './types'

export async function newUser ({ authId, username }: {authId: string, username: string}): Promise<number> {
  const db = await connect()
  const res = await db.query('INSERT INTO users("authId", "username") VALUES($1, $2) RETURNING id', [authId, username])
  return res.rows[0].id
}

export async function getUserByAuthId (authId: string): Promise<User | undefined> {
  const db = await connect()
  const res = await db.query('SELECT * FROM USERS WHERE "authId"=$1', [authId])
  return res.rows[0]
}

export async function getUserById (userId: number): Promise<User | undefined> {
  const db = await connect()
  const res = await db.query('SELECT * FROM USERS WHERE id=$1', [userId])
  return res.rows[0]
}
