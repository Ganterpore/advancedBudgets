import type { Actions } from './$types'
import { error, redirect } from '@sveltejs/kit'
import type { Investment } from '$lib/types/accountTypes'
import { createInvestmentAccount, updateInvestmentAccount } from '$lib/models/investmentModel'

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const data = await request.formData()
    const accountId = Number(data.get('id'))
    const accountName = data.get('account')
    const amount = data.get('amount') ?? 0
    const expectedROIPercent = data.get('expectedROIPercent') ?? 0
    const withdrawalRate = data.get('withdrawalRate') ?? 0

    if (!accountName) return error(400, 'Investment Name must not be empty')
    if (!expectedROIPercent) return error(400, 'Estimated ROI must not be empty')
    if (Number(expectedROIPercent) <= 0) return error(400, 'Estimated ROI must be greater than 0')
    if (withdrawalRate && Number(withdrawalRate) < 0) return error(400, 'Withdrawal rate must not be negative')

    const investment: Omit<Investment, 'id'> = {
      user: Number(locals.user!.id),
      name: accountName.toString(),
      expectedROI: Number(expectedROIPercent) * 100,
      withdrawalRate: Number(withdrawalRate) * 100,
      amount: Number(amount) * 100
    }
    if (!accountId || isNaN(accountId)) {
      await createInvestmentAccount(investment)
    } else {
      await updateInvestmentAccount({ ...investment, id: accountId })
    }
    return redirect(301, '/')
  }
}