<script>
  import {compoundedValue} from "$lib/helpers/financeHelpers";
  import {currencyToString} from "$lib/utils";

  export let yearsUntil
  export let inflationRate
  export let withdrawalRate
  export let currentBudget

  $: budgetInTime = inflationRate !== 0 ? compoundedValue(currentBudget, 0, inflationRate, 1, yearsUntil) : currentBudget
  $: capitalRequired = budgetInTime / (withdrawalRate * 0.01)
</script>

<p>
  {yearsUntil === 0 ? 'You have budgeted ' : `In ${yearsUntil} years your budget will be approximately `}{currencyToString(budgetInTime)} per year. <br/>
  In order to retire you will need {currencyToString(capitalRequired)} in capital
</p>