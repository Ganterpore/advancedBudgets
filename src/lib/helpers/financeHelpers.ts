export function compoundedValue (principle: number, regularDeposits: number, percentInterestRatePa: number, compoundingPeriodsPerYear: number, nYears: number) {
  const nCompounds = compoundingPeriodsPerYear * nYears
  const actualInterestRate = percentInterestRatePa/(compoundingPeriodsPerYear*100)
  const growthMultiplier = (1 + actualInterestRate) ** nCompounds
  return Math.round((principle + (regularDeposits / actualInterestRate)) * growthMultiplier - (regularDeposits / actualInterestRate))
}