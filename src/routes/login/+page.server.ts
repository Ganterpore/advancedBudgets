import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { getAuthToken } from '../(authed)/auth'
import type { Actions } from './$types'

export const actions: Actions = {
  default: async ({ cookies, url, request }) => {
    const data = await request.formData()
    let username = data.get('username')
    if (!username) return fail(400, { error: 'Username cannot be empty' })

    const authToken = await getAuthToken(username!.toString())
    cookies.set('auth_token', authToken, { path: '/' });
    throw redirect(303, url.searchParams.get('redirectTo') ?? '/');
  }
};
