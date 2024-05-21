import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'
import { getUserFromToken } from "../login/userModel";
import * as jose from 'jose'

import { PUBLIC_AUTH0_DOMAIN } from '$env/static/public'

export async function validateToken (token: string) {
  const JWKS = jose.createRemoteJWKSet(new URL(`https://${PUBLIC_AUTH0_DOMAIN}/.well-known/jwks.json`))
  const {payload} = await jose.jwtVerify(token, JWKS, {
    issuer: `https://${PUBLIC_AUTH0_DOMAIN}/`,
    audience: 'budget-backend',
  })
  return payload
}

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  const authToken = cookies.get('auth_token')
  if (!authToken) {
    throw redirect(303, `/login?redirectTo=${url.pathname}`)
  }
  await validateToken(authToken)
  let user
  try {
    user = await getUserFromToken(authToken)
  } catch (e) {
    console.log(e)
  }
  if (!user) {
    cookies.delete('auth_token', { path: '/' });
    throw redirect(303, '/login');
  }
  return {
    user
  }
}
