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

  $: budgetInTime = inflationRate !== 0 ? compoundedValue(currentBudget, 0, inflationRate, 1, yearsUntil) : currentBudget
  $: capitalRequired = budgetInTime / (withdrawalRate * 0.01)
  $: futureCapital = compoundedValue(currentCapital, budgetedAmountToCapital, interestRate, budgetPeriodsPerYear, yearsUntil)

  $: regularDepositedAmount = yearsUntil * budgetPeriodsPerYear * budgetedAmountToCapital
  $: simpleInterest = currentCapital * (interestRate/100) * yearsUntil

  function retirementDataInYears (year) {
    const futureBudget = inflationRate !== 0 ? compoundedValue(currentBudget, 0, inflationRate, 1, year) : currentBudget
    const futureNeeds = inflationRate !== 0 ? compoundedValue(currentNeeds, 0, inflationRate, 1, year) : currentNeeds
    const capitalRequired = futureBudget / (withdrawalRate * 0.01)
    const needsCapitalRequired = futureNeeds / (withdrawalRate * 0.01)
    const capital = compoundedValue(currentCapital, budgetedAmountToCapital, interestRate, budgetPeriodsPerYear, year)
    const deposits = year * budgetPeriodsPerYear * budgetedAmountToCapital
    const simpleInterest = currentCapital * (interestRate/100) * year
    const compoundedInterest = capital - deposits - simpleInterest - currentCapital
    return { year, capital, principle: currentCapital, deposits, simpleInterest, compoundedInterest, futureBudget, capitalRequired, needsCapitalRequired }
  }
  let retirementDataSet
  $: (age, budgetPeriodsPerYear, inflationRate, withdrawalRate, interestRate, currentBudget, currentCapital, budgetedAmountToCapital), retirementDataSet = Array.from(Array(yearsUntil + 1).keys()).map(y => retirementDataInYears(y))
</script>

<p>
  You have budgeted {currencyToString(currentBudget)} per year.<br/>
  You currently have {currencyToString(currentCapital)} in capital.<br/>
  <br/>

  <RetirementPlan age={age} theme={theme} data={retirementDataSet}/>

  In {yearsUntil} years your budget will be approximately {currencyToString(budgetInTime)} per year with {inflationRate}% inflation. <br/>
  In {yearsUntil} years you will have approximately {currencyToString(futureCapital)} in capital; <br/>
  <p style="font-style: italic; margin: 0 10px">
    {currencyToString(currentCapital)}
    + {currencyToString(regularDepositedAmount)} regular deposits
    + {currencyToString(simpleInterest)} interest
    + {currencyToString(futureCapital - (currentCapital + regularDepositedAmount + simpleInterest))} compounded interest.<br/>
  </p>
  <br/>
  {#if capitalRequired > futureCapital}
    In order to retire in {yearsUntil} years you will need {currencyToString(capitalRequired)} in capital.<br/>
  {:else }
    You will be able to retire on {currencyToString(futureCapital)} with a {currencyToString(futureCapital * withdrawalRate * 0.01)} yearly budget ({currencyToString((futureCapital * withdrawalRate * 0.01)/budgetPeriodsPerYear)} per budget period).
  {/if}

<style>
  p {
    margin: 5px;
  }
</style>