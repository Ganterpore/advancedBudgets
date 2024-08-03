import type { RequestHandler } from '@sveltejs/kit'
import { auth0, lucia } from '$lib/server/auth'
import { PUBLIC_AUTH0_DOMAIN } from '$env/static/public'
import { getUserByAuthId, newUser } from '$lib/models/userModel'

export const GET: RequestHandler = async (event) => {
  const code = event.url.searchParams.get('code')
  if (!code) {
    return new Response(null, {
      status: 303,
      headers: { location: '/login' }
    })
  }
  try {
    const tokens = await auth0.validateAuthorizationCode(code)
    const auth0UserResponse = await fetch(`https://${PUBLIC_AUTH0_DOMAIN}/userinfo`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    })
    const auth0User = await auth0UserResponse.json()
    const existingUser = await getUserByAuthId(auth0User.sub)
    if (existingUser) {
      const session = await lucia.createSession(existingUser.id.toString(), {})
      const sessionCookie = lucia.createSessionCookie(session.id)
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: '.',
        ...sessionCookie.attributes
      })
    } else {
      const id = await newUser({
        authId: auth0User.sub,
        username: auth0User.nickname
      })
      const session = await lucia.createSession(id.toString(), {})
      const sessionCookie = lucia.createSessionCookie(session.id)
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: '.',
        ...sessionCookie.attributes
      })
    }
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/"
      }
    })
  } catch (e) {
    console.error(e)
    return new Response(null, {
      status: 303,
      headers: { location: '/login' }
    })
  }
}