import { redirect } from '@sveltejs/kit'
import { lucia } from '$lib/server/auth'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, cookies }) => {
  if (!locals.session) {
    throw redirect(303, '/login')
  }
  await lucia.invalidateSession(locals.session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies.set(sessionCookie.name, sessionCookie.value, {
    path: ".",
    ...sessionCookie.attributes
  });
  throw redirect(303, '/login')
};
