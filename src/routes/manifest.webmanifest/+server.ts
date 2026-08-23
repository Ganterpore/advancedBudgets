import type { RequestHandler } from './$types'
import { themes } from '$lib/types/userTypes'
import { getSettingsForUser } from '$lib/models/userSettingsModel'
import { connect } from '$lib/db'

// Served dynamically (instead of a static manifest.webmanifest) so the PWA's theme_color and
// background_color — used for the install prompt and splash screen — match whichever theme the
// logged-in user has saved in Settings, rather than always being the default blue theme.
export const GET: RequestHandler = async ({ locals }) => {
  await connect()
  let themeName = 'default'
  if (locals.user) {
    const settings = await getSettingsForUser(Number(locals.user.id))
    themeName = (settings.theme && themes[settings.theme]) ? settings.theme : 'default'
  }
  const theme = themes[themeName]

  const manifest = {
    name: 'Advanced Budgets',
    short_name: 'Budgets',
    description: 'Track spending and manage budgets',
    start_url: '/',
    display: 'standalone',
    background_color: theme.background,
    theme_color: theme.background,
    icons: [
      { src: `/icons/${themeName}/icon-192.png`, sizes: '192x192', type: 'image/png' },
      { src: `/icons/${themeName}/icon-512.png`, sizes: '512x512', type: 'image/png' },
      { src: `/icons/${themeName}/icon-maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  }

  return new Response(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json',
      // Per-user content: never let a shared/edge cache serve one user's theme to another.
      'Cache-Control': 'private, no-cache'
    }
  })
}
