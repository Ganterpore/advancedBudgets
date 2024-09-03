<script>
  import {compoundedValue} from "$lib/helpers/financeHelpers";
  import {currencyToString} from "$lib/utils";

  export let yearsUntil
  export let budgetPeriodsPerYear
  export let inflationRate
  export let withdrawalRate
  export let interestRate
  export let currentBudget
  export let currentCapital
  export let budgetedAmountToCapital

  $: budgetInTime = inflationRate !== 0 ? compoundedValue(currentBudget, 0, inflationRate, 1, yearsUntil) : currentBudget
  $: capitalRequired = budgetInTime / (withdrawalRate * 0.01)
  $: futureCapital = compoundedValue(currentCapital, budgetedAmountToCapital, interestRate, budgetPeriodsPerYear, yearsUntil)

  $: regularDepositedAmount = yearsUntil * budgetPeriodsPerYear * budgetedAmountToCapital
  $: simpleInterest = currentCapital * (interestRate/100) * yearsUntil
</script>

<p>
  You have budgeted {currencyToString(currentBudget)} per year.<br/>
  You currently have {currencyToString(currentCapital)} in capital.<br/>
  <br/>

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