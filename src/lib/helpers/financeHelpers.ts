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