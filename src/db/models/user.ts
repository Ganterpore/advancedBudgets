import { connect } from '../db'

export type User = {
  id: number
  username: string
}

export async function newUser ({ username }: {username: string}): Promise<number> {
  const db = await connect()
  const res = await db.query('INSERT INTO users("username") VALUES($1) RETURNING id', [username])
  return res.rows[0].id
}

export async function getUserByUsername (username: string): Promise<User> {
  const db = await connect()
  const res = await db.query('SELECT * FROM USERS WHERE username=$1', [username])
  return res.rows[0]
}

export async function getUserById (userId: number): Promise<User | undefined> {
  const db = await connect()
  const res = await db.query('SELECT * FROM USERS WHERE id=$1', [userId])
  return res.rows[0]
}