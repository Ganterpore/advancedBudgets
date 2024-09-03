import { connect } from '$lib/db'
import type { Settings } from '$lib/types/userTypes'

async function newSettings (settings: Omit<Settings, 'id'>) {
  const db = await connect()
  const res = await db.query(`
    INSERT INTO user_settings("user", "theme") 
    VALUES($1, $2) RETURNING id`,
    [settings.user, settings.theme ?? 'default'])
  return res.rows[0].id
}

export async function getSettingsForUser (userId: number): Promise<Settings> {
  const db = await connect()
  const res = await db.query(
    'SELECT * from user_settings WHERE "user"=$1',
    [userId]
  )
  if (!res.rows[0]) {
    await newSettings({ user: userId })
    return getSettingsForUser(userId)
  }
  return res.rows[0]
}

export async function updateSettings (settings: Settings) {
  const db = await connect()
  await db.query(`
    UPDATE user_settings SET ("theme", "user") = ($1, $2) 
    WHERE ID=$3`,
    [settings.theme, settings.user, settings.id])
}
