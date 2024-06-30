import { Lucia} from 'lucia'
import { dev} from '$app/environment'
import { NodePostgresAdapter } from '@lucia-auth/adapter-postgresql'
import pg from 'pg'

const pool = new pg.Pool()
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
