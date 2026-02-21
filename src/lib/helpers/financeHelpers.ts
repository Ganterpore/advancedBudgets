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