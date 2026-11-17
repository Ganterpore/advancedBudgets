import type { Actions, PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import type { Investment } from '$lib/types/accountTypes'
import {
  addInvestmentValue,
  deleteInvestmentValue,
  getInvestmentValues,
  updateInvestmentValue
} from '$lib/models/investmentValue'
import { archiveInvestmentAccount } from '$lib/models/investmentModel'

export const load: PageServerLoad = async ({ params, parent, locals, depends }) => {
  const investmentId = Number(params.id)
  const layout = await parent()
  depends('data:values')
  const investment = (layout.investments as Investment[]).find(i => i.id === investmentId)
  if (!investment) throw error(404, 'Investment not found')
  const values = await getInvestmentValues(investmentId, Number(locals.user!.id))
  return { investment, values }
}

/** Reads a dollar amount from the form and returns it in cents */
function parseAmount (data: FormData): number {
  const raw = data.get('amount')
  const amount = Number(raw)
  if (raw === null || raw === '' || isNaN(amount)) throw error(400, 'Value must be a number')
  if (amount < 0) throw error(400, 'Value must not be negative')
  return amount * 100
}

function parseValueId (data: FormData): number {
  const valueId = Number(data.get('valueId'))
  if (!valueId) throw error(400, 'Value id must be specified')
  return valueId
}

export const actions: Actions = {
  // Records a new current value for the investment
  value: async ({ params, request, locals }) => {
    const data = await request.formData()
    await addInvestmentValue(Number(params.id), Number(locals.user!.id), parseAmount(data))
  },
  // Changes the amount and date of a historic value
  editValue: async ({ request, locals }) => {
    const data = await request.formData()
    const onDate = new Date(String(data.get('onDate')))
    if (isNaN(onDate.getTime())) throw error(400, 'Date must be valid')
    await updateInvestmentValue(parseValueId(data), Number(locals.user!.id), parseAmount(data), onDate)
  },
  deleteValue: async ({ request, locals }) => {
    const data = await request.formData()
    await deleteInvestmentValue(parseValueId(data), Number(locals.user!.id))
  },
  archive: async ({ params, locals }) => {
    await archiveInvestmentAccount(Number(params.id), Number(locals.user!.id))
  }
}
