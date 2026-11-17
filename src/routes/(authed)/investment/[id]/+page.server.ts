import type { Actions, PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import type { Investment } from '$lib/types/accountTypes'
import { addInvestmentValue, getInvestmentValues } from '$lib/models/investmentValue'

export const load: PageServerLoad = async ({ params, parent, locals, depends }) => {
  const investmentId = Number(params.id)
  const layout = await parent()
  depends('data:values')
  const investment = (layout.investments as Investment[]).find(i => i.id === investmentId)
  if (!investment) throw error(404, 'Investment not found')
  const values = await getInvestmentValues(investmentId, Number(locals.user!.id))
  return { investment, values }
}

export const actions: Actions = {
  // Records a new current value for the investment
  default: async ({ params, request, locals }) => {
    const data = await request.formData()
    const amount = Number(data.get('amount'))
    if (data.get('amount') === null || data.get('amount') === '' || isNaN(amount)) {
      return error(400, 'Current Value must be a number')
    }
    if (amount < 0) return error(400, 'Current Value must not be negative')
    await addInvestmentValue(Number(params.id), Number(locals.user!.id), amount * 100)
  }
}
