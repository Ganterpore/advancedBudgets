import type { PageServerLoad } from './$types'
import { VERCEL_URL } from '$env/static/private'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ cookies }) => {
  const authToken = cookies.get('auth_token')
  if (authToken) {
    throw redirect(303, '/')
  }
  return {
    baseUrl: VERCEL_URL
  }
}
