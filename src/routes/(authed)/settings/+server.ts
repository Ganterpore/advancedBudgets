import type { RequestHandler } from '@sveltejs/kit'
import type { Settings } from '$lib/types/userTypes'
import { updateSettings } from '$lib/models/userSettingsModel'

export const POST: RequestHandler = async ({ request, locals }) => {
  const settings: Settings = await request.json()
  settings.user = Number(locals.user!.id)
  await updateSettings(settings)
  return new Response(null, { status: 204 })
}