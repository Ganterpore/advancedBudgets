import type { RequestHandler } from '@sveltejs/kit'
import { generateState } from 'arctic'
import { auth0 } from '$lib/server/auth'
import { redirect } from '@sveltejs/kit'

export const GET: RequestHandler = async (event) => {
  const state = generateState()
  const url = await auth0.createAuthorizationURL(state, {
    scopes: ['profile']
  })
  event.cookies.set('auth0_oauth_state', state, {
    path: '/',
    secure: import.meta.env.PROD,
    httpOnly: true,
    maxAge: 60*24*2,
    sameSite: 'lax'
  })
  redirect(302, url.toString())
}
