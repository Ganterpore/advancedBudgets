import type { RequestHandler } from '@sveltejs/kit'
import { error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { getUserByAuthId, getUserById, newUser } from "./userModel";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const { authToken, authId, username } = await request.json()
  let user = await getUserByAuthId(authId)
  if (!user) {
    const id = await newUser({ authId, username })
    user = await getUserById(id)
    if (!user) throw error(500, 'failed to create user')
  }
  if (!authToken) throw error(400, 'Auth Token cannot be empty' )

  cookies.set('auth_token', authToken.toString(), { path: '/' })
  throw redirect(303, '/');
}
