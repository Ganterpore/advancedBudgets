import type { RequestHandler } from './$types'
import { json} from '@sveltejs/kit'
import { createNewAccount, updateAccount } from '$lib/controllers/accountController'
import { AccountHierarchy } from '../../../params/accountHierarchy'
import { newParentAccount } from '$lib/models/parentAccountModel'

export const POST: RequestHandler = async ({ request, params, locals }) => {
  const { type } = params
  const data = await request.json()
  const accountName = data.account
  let id
  switch (type) {
    case AccountHierarchy.PARENT_ACCOUNT:
      if (!accountName) return json({ error: 'Account Name must not be empty' }, { status: 400 })

      if (data.id) {
        // TODO update instead
      } else {
        id = await newParentAccount({user: Number(locals.user!.id), name: accountName.toString()})
      }
      break
    case AccountHierarchy.ACCOUNT:
      if (!data.name) return json({ error: 'Account Name must not be empty' }, { status: 400 })
      if (!data.type) return json({ error: 'Account type must not be empty' }, { status: 400 })
      if (!data.parent) return json({error: 'Account parent must not be empty'}, {status: 400})
      if (data.id) {
        await updateAccount(data)
        id = data.id
      } else {
        id = await createNewAccount(data)
      }
      break
  }
  return json({ id }, { status: 201 })
}
