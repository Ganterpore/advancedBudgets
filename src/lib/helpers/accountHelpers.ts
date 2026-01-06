export function savingsAccountMultiplierToString (multiplier: number) {
  return multiplier === 0 ? '⏸' : multiplier / 100 + 'X'
}
