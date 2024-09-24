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