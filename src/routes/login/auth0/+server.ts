import type { RequestHandler } from '@sveltejs/kit'
import { generateState } from 'arctic'
import { auth0 } from '$lib/server/auth'
import { redirect } from '@sveltejs/kit'

export const GET: RequestHandler = async (event) => {
  const state = generateState()
  const url = await auth0.createAuthorizationURL(state, {
    scopes: ['profile']
  })
  redirect(302, url.toString())
}
