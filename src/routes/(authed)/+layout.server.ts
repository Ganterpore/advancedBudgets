import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'
import { getUserFromToken } from "../login/userModel";
import { validateToken } from "$lib/utils";
import { VERCEL_URL } from '$env/static/private'

export const load: LayoutServerLoad = async ({ cookies }) => {
  const authToken = cookies.get('auth_token')
  if (!authToken) {
    throw redirect(303, '/login')
  }
  try {
    await validateToken(authToken)
  } catch (e) {
    cookies.delete('auth_token', { path: '/' })
    throw redirect(303, '/login');
  }
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
    baseUrl: VERCEL_URL,
    user
  }
}
