import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'
import { getUserDetailsFromToken } from './auth'

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  const authToken = cookies.get('auth_token')
  if (!authToken) {
    throw redirect(303, `/login?redirectTo=${url.pathname}`)
  }
  const user = await getUserDetailsFromToken(authToken)
  if (!user) {
    cookies.delete('auth_token', { path: '/' });
    throw redirect(303, '/');
  }
  return {
    authToken,
    user
  }
}
