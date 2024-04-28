import { connect } from '../db/db'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  await connect()
}