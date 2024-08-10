import type { PageServerLoad } from './$types'
import { getUserById } from '$lib/models/userModel'

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user ? await getUserById(Number(locals.user.id)) : undefined
  return {
    user
  }
}