import type { Investment } from '$lib/types/accountTypes'

export function getIncomeFromInvestment (investment: Investment, paymentsPerYear: number) {
  const PERCENT_TO_MULTIPLIER = 10000
  const withdrawalRate = investment.withdrawalRate / paymentsPerYear
  const withdrawnAmount = investment.amount * withdrawalRate
  return Math.floor(withdrawnAmount / PERCENT_TO_MULTIPLIER)
}

export function getEstimateExcessFromInvestment (investment: Investment, paymentsPerYear: number) {
  const PERCENT_TO_MULTIPLIER = 10000
  const returnRate = (investment.expectedROI - investment.withdrawalRate) / paymentsPerYear
  const returnAmount = investment.amount * returnRate
  return Math.floor(returnAmount / PERCENT_TO_MULTIPLIER)
}
