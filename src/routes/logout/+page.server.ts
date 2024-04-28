import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
  default: ({ cookies }) => {
    cookies.delete('auth_token', { path: '/' });
    throw redirect(303, '/');
  }
};
