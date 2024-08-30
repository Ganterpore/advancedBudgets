import type { LayoutServerLoad } from './$types'
import { connect } from '$lib/db'
import type { Settings } from '$lib/types/userTypes'
import { getSettingsForUser } from '$lib/models/userSettingsModel'

export const load: LayoutServerLoad = async ({ depends, locals }) => {
  await connect()
  depends('data:accounts')
  depends('data:settings')
  let settings: Omit<Settings, 'id' | 'user'> & Partial<Settings> = {
    theme: 'default'
  }
  if (locals.user) {
    const userId = Number(locals.user.id)
    settings = await getSettingsForUser(userId)
  }
  return {
    settings
  }
}