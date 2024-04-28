import { getUserDetailsFromToken } from './(authed)/auth'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad =  async ({ cookies }) => {
  const authToken = cookies.get('auth_token')
  let user = authToken ? await getUserDetailsFromToken(authToken) : undefined
  return {
    authToken,
    user
  }
}