import type { Handle, RequestEvent } from '@sveltejs/kit'
import { lucia } from '$lib/server/auth'

const handleLuciaAuthentication = async (event: RequestEvent) => {
  const sessionId = event.cookies.get(lucia.sessionCookieName)
  if (!sessionId) {
    event.locals.user = null
    event.locals.session = null
    return
  }

  const { session, user } = await lucia.validateSession(sessionId)
  if (session?.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id)
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    })
  }
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie()
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    })
  }
  event.locals.user = user
  event.locals.session = session
}

export const handle: Handle = async ({event, resolve}) => {
  await handleLuciaAuthentication(event)
  // If not authed, redirect to login page
  if (!event.url.pathname.startsWith('/login') && !event.locals.user) {
    return new Response(null, {
      status: 303,
      headers: { location: '/login' }
    })
  }

  return resolve(event)
}
