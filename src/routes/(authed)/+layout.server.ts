import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'
import { getUserFromToken } from "../login/userModel";
import { validateToken } from "$lib/utils";


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
