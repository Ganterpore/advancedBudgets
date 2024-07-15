import type { LayoutServerLoad } from './$types'
import { getUserById } from '$lib/models/userModel'
export const load: LayoutServerLoad = async ({ locals }) => {
  const user = locals.user ? await getUserById(Number(locals.user.id)) : undefined
  return {
    user
  }
}
