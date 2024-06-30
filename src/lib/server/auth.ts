import { Lucia } from 'lucia'
import { dev} from '$app/environment'
import { NodePostgresAdapter } from '@lucia-auth/adapter-postgresql'
import pg from 'pg'
import { Auth0 } from 'arctic'
import { PUBLIC_AUTH0_DOMAIN, PUBLIC_AUTH0_CLIENT_ID } from '$env/static/public'
import { VERCEL_URL, AUTH0_CLIENT_SECRET } from '$env/static/private'
import { clientDetails } from '$lib/db'

const pool = new pg.Pool(clientDetails)
const adaptor = new NodePostgresAdapter(pool, {
  user: 'users',
  session: 'user_session'
})

export const lucia = new Lucia(adaptor, {
  sessionCookie: {
    attributes: {
      secure: !dev
    }
  }
})

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
  }
}

export const auth0 = new Auth0(`https://${PUBLIC_AUTH0_DOMAIN}`,
  PUBLIC_AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  `${VERCEL_URL.startsWith('http') ? '' : 'https://'}${VERCEL_URL}/login/auth0/callback`
)

export type Auth = typeof lucia