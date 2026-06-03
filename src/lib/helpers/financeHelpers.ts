export function compoundedValue (principle: number, regularDeposits: number, percentInterestRatePa: number, compoundingPeriodsPerYear: number, nYears: number) {
  const nCompounds = compoundingPeriodsPerYear * nYears
  const actualInterestRate = percentInterestRatePa/(compoundingPeriodsPerYear*100)
  if (actualInterestRate === 0) {
    const result = principle + regularDeposits * nCompounds
    return Math.round(result)
  }
  const growthMultiplier = (1 + actualInterestRate) ** nCompounds
  const result = (principle + (regularDeposits / actualInterestRate)) * growthMultiplier - (regularDeposits / actualInterestRate)
  return Math.round(result)
}

export function calculateN (P: number, rate: number, M: number) {
  const r = (rate / 100) / 12; // Convert annual % to monthly decimal
  const result = Math.log(M / (M - P * r)) / Math.log(1 + r)
  if (isNaN(result)) return '∞'
  return Math.round(result)
}

export function formatDuration (totalMonths: number) {
  if (!isFinite(totalMonths)) return "Never (interest exceeds repayment)";

  // Use Math.ceil because even a partial month requires a full payment
  const total = Math.ceil(totalMonths);
  const years = Math.floor(total / 12);
  const months = total % 12;

  const yLabel = years === 1 ? "Year" : "Years";
  const mLabel = months === 1 ? "Month" : "Months";

  const yearPart = years > 0 ? `${years} ${yLabel}` : "";
  const monthPart = months > 0 ? `${months} ${mLabel}` : "";

  return [yearPart, monthPart].filter(Boolean).join(" and ") || "0 Months";
}

export type RetirementChartData = {
  year: number,
  capital: number,
  principle: number,
  deposits: number,
  simpleInterest: number,
  // compoundedInterest: number, // This should be the same as capital...
  needsCapitalRequired: number,
  capitalRequired: number,
  // debtCapitalRequired: number,
  debtRemaining: number
}
export function retirementDataInYears (
  yearsUntil: number,
  prev: RetirementChartData,
  debts: { amountLeft: number, percent: number, regularRepayment: number }[],
  globalSettings: {
    regularSavingsDeposit: number,
    budgetPeriodsPerYear: number,
    savingsInterestRate: number,
    inflationRate: number,
    withdrawalRate: number
  }): RetirementChartData[] {
  if (yearsUntil === 0) return [prev]
  // Move numbers forward a year
  const next: RetirementChartData = {
    year: prev.year + 1,
    capital: compoundedValue(prev.capital, globalSettings.regularSavingsDeposit, globalSettings.savingsInterestRate, globalSettings.budgetPeriodsPerYear, 1),
    principle: prev.principle,
    deposits: prev.deposits + globalSettings.budgetPeriodsPerYear * globalSettings.regularSavingsDeposit,
    simpleInterest: prev.simpleInterest + (prev.principle * (globalSettings.savingsInterestRate/100)),
    needsCapitalRequired: prev.needsCapitalRequired * (1 + (globalSettings.inflationRate / 100)),
    capitalRequired: prev.capitalRequired * (1 + (globalSettings.inflationRate / 100)),
    debtRemaining: prev.debtRemaining
  }
  // If we have excess capital above what we need, use it to pay off debts first
  let additionalDebtRepayment = 0
  if (next.capital > next.capitalRequired && next.debtRemaining > 0) {
    additionalDebtRepayment = next.capital - next.capitalRequired
    next.capital = next.capitalRequired
  }
  let additionalFunds = 0
  // Move debt forward a year
  const nextYearsDebt: { amountLeft: number, percent: number, regularRepayment: number }[] = []
  // Descending order, so that we use additional funds to pay off more expensive debts first
  debts.sort((a, b) => b.percent - a.percent)
  for (const debt of debts) {
    let amountLeft = debt.amountLeft
    if (debt.amountLeft > 0) {
      amountLeft = -1 * compoundedValue(-1 * debt.amountLeft, debt.regularRepayment, debt.percent, 12, 1)
      if (amountLeft < 0) {
        additionalFunds += -1 * amountLeft
        amountLeft = 0
      } else if (additionalDebtRepayment > 0) {
        const amountToPay = Math.min(additionalDebtRepayment, amountLeft)
        amountLeft -= amountToPay
        additionalDebtRepayment -= amountToPay
      }
    } else {
      additionalFunds += 12 * debt.regularRepayment
    }
    nextYearsDebt.push({
      ...debt,
      amountLeft
    })
  }
  if (additionalDebtRepayment > 0) next.capital += additionalDebtRepayment
  next.debtRemaining = nextYearsDebt.reduce((debtRemaining, debt) => {
    return debtRemaining + debt.amountLeft
  }, 0)
  // If we have additional funds left, deposit them in retirement savings
  next.capital += additionalFunds
  // Get future data
  const futureData = retirementDataInYears(yearsUntil - 1, next, nextYearsDebt, globalSettings)
  futureData.unshift(prev)
  return futureData
}