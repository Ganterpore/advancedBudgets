<script>
  import {compoundedValue} from "$lib/helpers/financeHelpers";
  import {currencyToString} from "$lib/utils";
  import RetirementPlan from "$lib/components/retirementComponents/RetirementPlan.svelte";
  import MetricsGrid from '$lib/components/sharedComponents/MetricsGrid.svelte'

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
          if (compoundedValue(d.currentBalance - d.principal, d.regularRepayment, d.percent, 12, y) >= 0) {
            return {
              year: y,
              // Convert monthly repayment to per-period deposit equivalent
              extraPerPeriod: (d.regularRepayment * 12) / budgetPeriodsPerYear
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
    let { capital, totalDeposits } = capitalWithDebtBoost(year)

    let debtRemaining = debts
      .map(d => Math.min(0, compoundedValue(d.currentBalance - d.principal, d.regularRepayment, d.percent, 12, year)))
      .reduce((totalDebtRemaining, debtRemaining) => totalDebtRemaining + Math.abs(debtRemaining), 0)

    if (capital > capitalRequired && debtRemaining > 0) {
      const capitalDiff = Math.min(capital - capitalRequired, debtRemaining)
      capital = capital - capitalDiff
      debtRemaining = debtRemaining - capitalDiff
    }
    const deposits = totalDeposits
    const simpleInterest = currentCapital * (interestRate/100) * year
    const compoundedInterest = capital - deposits - simpleInterest - currentCapital

    const debtCapitalRequired = capitalRequired + debtRemaining
    return { year, capital, principle: currentCapital, deposits, simpleInterest, compoundedInterest, futureBudget, capitalRequired, needsCapitalRequired, debtCapitalRequired, debtRemaining }
  }
  let retirementDataSet
  $: (age, budgetPeriodsPerYear, inflationRate, withdrawalRate, interestRate, currentBudget, currentCapital, budgetedAmountToCapital, debts), retirementDataSet = Array.from(Array(yearsUntil + 1).keys()).map(y => retirementDataInYears(y))
  $: finalYearData = retirementDataSet[retirementDataSet.length - 1]
</script>

<p>
  <RetirementPlan age={age} theme={theme} data={retirementDataSet}/>
  <i>Assumes you will increase retirement saving when a debt is payed off, and increase debt pay off if you have reached your desired passive income</i>
  <br/>
  {#if Number(age) === 0}
    In {yearsUntil} years:
  {:else}
    At Age {Number(yearsUntil) + Number(age)}:
  {/if}
  <br/>
  <MetricsGrid metrics={[
    { label: 'Expected Monthly Budget', value: currencyToString(finalYearData.futureBudget / 12), subValue: currencyToString(finalYearData.futureBudget) + ' pa' },
    { label: 'Monthly Passive Income', value: currencyToString((finalYearData.capital * withdrawalRate * 0.01) / 12), subValue: currencyToString(finalYearData.capital * withdrawalRate * 0.01) + ' pa' },
    { label: 'Capital', value: currencyToString(finalYearData.capital) },
    { label: 'Debt', value: currencyToString(finalYearData.debtRemaining) },
    { label: 'Capital Required to Retire with 0 debt', value: currencyToString(finalYearData.debtCapitalRequired) },
    ]} />
  {#if finalYearData.capital >= finalYearData.debtCapitalRequired}
    <div class="toast" >Ready to retire with 0 debt.</div>
  {:else if finalYearData.capital >= finalYearData.capitalRequired}
    <div class="toast" >Passive income outweighs budget, but still in debt.</div>
  {:else}
    <div style="margin: 3px;"/>
  {/if}
</p>

<style>
  .toast {
    width: fit-content;
    background-color: var(--theme-alert);
    margin: 3px;
    padding: 3px;
    border-radius: 2px;
  }
  p {
    margin: 5px;
  }
</style>