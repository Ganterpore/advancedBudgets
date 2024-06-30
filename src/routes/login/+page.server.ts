import type { PageServerLoad } from './$types'
import { VERCEL_URL } from '$env/static/private'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.session?.expiresAt && locals.session?.expiresAt > new Date()) {
    throw redirect(303, '/')
  }
  return {
    baseUrl: VERCEL_URL
  }
}
