import type { Actions } from '@sveltejs/kit'
import { error } from '@sveltejs/kit'
import type { Debt } from '$lib/types/accountTypes'
import { newDebt, updateDebt } from '$lib/models/debtModel'

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const data = await request.formData()
    // Get data
    const id = Number(data.get('id'))
    const parent = Number(data.get('parent'))
    const name = data.get('name')?.toString()
    const principal = Number(data.get('principal'))
    const percent = Number(data.get('percent'))
    const regularRepayment = Number(data.get('regularRepayment'))
    const nominatedAccount = Number(data.get('nominatedAccount'))
    // Validate
    if (!name) return error(400, 'Debt Name must not be empty')
    if ([principal, percent, regularRepayment].includes(NaN)) {
      return error(400, 'principal, percent and regularRepayment must be numbers')
    }
    const debt: Omit<Debt, 'id'|'parent'|'nominatedAccount'> = {
      name,
      user: Number(locals.user!.id),
      principal: principal * 100,
      percent,
      regularRepayment: regularRepayment * 100
    }
    if (id && parent && nominatedAccount) {
      await updateDebt({...debt, id, parent, nominatedAccount })
    } else {
      await newDebt(debt)
    }
  }
}