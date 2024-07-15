import type { PageServerLoad } from './$types'
import { VERCEL_URL, IGNORE_AUTH } from '$env/static/private'
import { redirect } from '@sveltejs/kit'
import { dev } from '$app/environment'

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.session?.expiresAt && locals.session?.expiresAt > new Date()) {
    throw redirect(303, '/')
  }
  if (dev && IGNORE_AUTH === 'true') {
    throw redirect(303, '/')
  }
  return {
    baseUrl: VERCEL_URL
  }
}
