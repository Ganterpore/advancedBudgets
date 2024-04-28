import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = ({ cookies, url }) => {
  if (!cookies.get('auth_token')) {
    throw redirect(303, `/login?redirectTo=${url.pathname}`)
  }
}