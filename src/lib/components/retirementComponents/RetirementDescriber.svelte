<script>
  import {compoundedValue} from "$lib/helpers/financeHelpers";
  import {currencyToString} from "$lib/utils";
  import RetirementPlan from "$lib/components/retirementComponents/RetirementPlan.svelte";

  export let theme
  export let age
  export let yearsUntil
  export let budgetPeriodsPerYear
  export let inflationRate
  export let withdrawalRate
  export let interestRate
  export let currentBudget
  export let currentNeeds
  export let currentCapital
  export let budgetedAmountToCapital
  export let debts

  $: budgetInTime = inflationRate !== 0 ? compoundedValue(currentBudget, 0, inflationRate, 1, yearsUntil) : currentBudget
  $: capitalRequired = budgetInTime / (withdrawalRate * 0.01)
  $: futureCapital = compoundedValue(currentCapital, budgetedAmountToCapital, interestRate, budgetPeriodsPerYear, yearsUntil)

  // For each mortgage, find the year it gets paid off (returns null if not paid off within yearsUntil)
  function getDebtPayoffEvents() {
    return debts
      .map(d => {
        for (let y = 0; y <= yearsUntil; y++) {
          if (compoundedValue(d.currentBalance - d.principal, d.payPerPeriod, d.percent, 12, y) >= 0) {
            return {
              year: y,
              // Convert monthly repayment to per-period deposit equivalent
              extraPerPeriod: (d.payPerPeriod * 12) / budgetPeriodsPerYear
            }
          }
        }
        return null
      })
      .filter(Boolean)
      .sort((a, b) => a.year - b.year)
  }

  // Calculate capital at a given year, accounting for freed-up debt repayments
  // being redirected into savings after each debt is paid off
  function capitalWithDebtBoost(targetYear) {
    const payoffEvents = getDebtPayoffEvents()

    // Filter to only events that occur before or at the target year
    const relevantEvents = payoffEvents.filter(e => e.year <= targetYear)

    let capital = currentCapital
    let deposits = budgetedAmountToCapital
    let prevYear = 0
    let totalDeposits = 0

    for (const payoff of relevantEvents) {
      const segmentYears = payoff.year - prevYear
      if (segmentYears > 0) {
        capital = compoundedValue(capital, deposits, interestRate, budgetPeriodsPerYear, segmentYears)
        totalDeposits += segmentYears * budgetPeriodsPerYear * deposits
      }
      deposits += payoff.extraPerPeriod
      prevYear = payoff.year
    }

    // Final segment from last payoff event to target year
    const remainingYears = targetYear - prevYear
    if (remainingYears > 0) {
      capital = compoundedValue(capital, deposits, interestRate, budgetPeriodsPerYear, remainingYears)
      totalDeposits += remainingYears * budgetPeriodsPerYear * deposits
    }

    return { capital, totalDeposits, effectiveDepositsPerPeriod: deposits }
  }

  function retirementDataInYears (year) {
    const futureBudget = inflationRate !== 0 ? compoundedValue(currentBudget, 0, inflationRate, 1, year) : currentBudget
    const futureNeeds = inflationRate !== 0 ? compoundedValue(currentNeeds, 0, inflationRate, 1, year) : currentNeeds
    const capitalRequired = futureBudget / (withdrawalRate * 0.01)
    const needsCapitalRequired = futureNeeds / (withdrawalRate * 0.01)
    const { capital, totalDeposits } = capitalWithDebtBoost(year)
    const deposits = totalDeposits
    const simpleInterest = currentCapital * (interestRate/100) * year
    const compoundedInterest = capital - deposits - simpleInterest - currentCapital

    const debtRemaining = debts
      .map(d => Math.min(0, compoundedValue(d.currentBalance - d.principal, d.payPerPeriod, d.percent, 12, year)))
      .reduce((totalDebtRemaining, debtRemaining) => totalDebtRemaining + Math.abs(debtRemaining), 0)
    const debtCapitalRequired = capitalRequired + debtRemaining
    return { year, capital, principle: currentCapital, deposits, simpleInterest, compoundedInterest, futureBudget, capitalRequired, needsCapitalRequired, debtCapitalRequired }
  }
  let retirementDataSet
  $: (age, budgetPeriodsPerYear, inflationRate, withdrawalRate, interestRate, currentBudget, currentCapital, budgetedAmountToCapital, debts), retirementDataSet = Array.from(Array(yearsUntil + 1).keys()).map(y => retirementDataInYears(y))
</script>

<p>
  <RetirementPlan age={age} theme={theme} data={retirementDataSet}/>
  <br/>
  {#if Number(age) === 0}
    In {yearsUntil} years:
  {:else}
    At Age {Number(yearsUntil) + Number(age)}:
  {/if}
  <br/>
  With {inflationRate}% inflation your budget will be {currencyToString(budgetInTime)} per year.
  <br/>
  You will have approximately {currencyToString(futureCapital)} in capital. <br/>
  <br/>
  {#if capitalRequired > futureCapital}
    In order to retire you will need {currencyToString(capitalRequired)} in capital.<br/>
  {:else }
    You will be able to retire with a {currencyToString(futureCapital * withdrawalRate * 0.01)} yearly budget.
  {/if}
</p>

<style>
  p {
    margin: 5px;
  }
</style>