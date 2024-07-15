import type { Handle, RequestEvent } from '@sveltejs/kit'
import { lucia } from '$lib/server/auth'
import { IGNORE_AUTH } from '$env/static/private'
import { dev } from '$app/environment'
import { getUserByAuthId, newUser } from '$lib/models/userModel'

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
  if (dev && IGNORE_AUTH === 'true') {
    if (!event.locals.user) {
      const user = await getUserByAuthId('abc123')
      if (!user) {
        const id = await newUser({authId: 'abc123', username: 'Alice'})
        event.locals.user = { id: id.toString() }
      } else {
        event.locals.user = { id: user.id }
      }
    }
    return resolve(event)
  }
  console.log('abcdef')
  await handleLuciaAuthentication(event)
  // If not authed, redirect to login page
  if (!event.url.pathname.startsWith('/login') && !event.locals.user) {
    event.locals.user = null
    event.locals.session = null
    return new Response(null, {
      status: 303,
      headers: { location: '/login' }
    })
  }

  return resolve(event)
}
