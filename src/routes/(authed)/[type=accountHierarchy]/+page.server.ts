import type { Actions } from './$types'
import { AccountHierarchy } from '../../../params/accountHierarchy'
import { error, redirect } from '@sveltejs/kit'
import { newParentAccount, updateParentAccount } from '$lib/models/parentAccountModel'
import { createNewAccount, updateAccount } from '$lib/controllers/accountController'
import type { Account } from '$lib/types/accountTypes'
import { AccountType } from '$lib/types/accountTypes'

export const actions: Actions = {
  default: async ({ params, locals, request }) => {
    const { type } = params
    const data = await request.formData()
    const accountName = data.get('account')
    let id
    if (type === AccountHierarchy.PARENT_ACCOUNT) {
      if (!accountName) return error(400, 'Account Name must not be empty')

      id = data.get('id')
      if (id && !isNaN(Number(id))) {
        await updateParentAccount({
          id: Number(id),
          user: Number(locals.user!.id),
          name: accountName.toString()
        })
      } else {
        id = await newParentAccount({user: Number(locals.user!.id), name: accountName.toString()})
      }
    } else if (type === AccountHierarchy.ACCOUNT) {
      if (!data.has('name')) return error(400, 'Account Name must not be empty')
      if (!data.has('type')) return error(400, 'Account type must not be empty')
      if (!data.has('parent')) return error(400, 'Account parent must not be empty')
      const account: Omit<Account, 'id'> = {
        name: data.get('name')!.toString(),
        type: data.get('type')!.toString() as AccountType,
        parent: Number(data.get('parent')),
        archived: Boolean(data.get('archived'))
      }
      if (data.has('id')) {
        id = Number(data.get('id'))
        if (data.has('additionalAccountData')) return error(400, 'Currently unable to handle special account types with forms')
        await updateAccount({...account, id})
      } else {
        id = await createNewAccount(account)
      }
    }
    return redirect(301, '/')
  }
}