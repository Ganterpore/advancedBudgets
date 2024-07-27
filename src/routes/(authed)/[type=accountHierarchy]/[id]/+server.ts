import { AccountHierarchy } from '../../../../params/accountHierarchy'
import { archiveParentAccount } from '$lib/models/parentAccountModel'
import { archiveAccount } from '$lib/models/accountModel'
import type { RequestHandler } from '@sveltejs/kit'
import { json } from '@sveltejs/kit'

export const DELETE: RequestHandler = async ({ params }) => {
  const { type, id } = params
  const accountId = Number(id)
  if (!type || isNaN(accountId)) return json({ error: 'Type and ID must be specified' }, { status: 400 })
  switch (type) {
    case AccountHierarchy.PARENT_ACCOUNT:
      await archiveParentAccount(accountId)
      break
    case AccountHierarchy.ACCOUNT:
      await archiveAccount(accountId)
      break
  }
  return new Response(null, { status: 204 })
}