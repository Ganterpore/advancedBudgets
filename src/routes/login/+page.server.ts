import type { PageServerLoad } from './$types'
import { VERCEL_URL } from '$env/static/private'

export const load: PageServerLoad = async () => {
  return {
    baseUrl: VERCEL_URL
  }
}
