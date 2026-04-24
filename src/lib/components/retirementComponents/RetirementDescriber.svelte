<script>
  import { retirementDataInYears } from '$lib/helpers/financeHelpers'
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

  let retirementDataSet
  $: (age, budgetPeriodsPerYear, inflationRate, withdrawalRate, interestRate, currentBudget, currentCapital, budgetedAmountToCapital, debts), retirementDataSet = retirementDataInYears(
    yearsUntil,
    {
      year: 0,
      capital: currentCapital,
      principle: currentCapital,
      deposits: 0,
      simpleInterest: 0,
      needsCapitalRequired: currentNeeds / (withdrawalRate * 0.01),
      capitalRequired: currentBudget / (withdrawalRate * 0.01),
      debtRemaining: debts.reduce((totalDebtRemaining, d) => totalDebtRemaining + Math.max(0, d.principal - d.currentBalance), 0)
    },
    debts.map(d => ({
      amountLeft: Math.max(0, d.principal - d.currentBalance),
      percent: d.percent,
      regularRepayment: d.regularRepayment
    })),
    {
      regularSavingsDeposit: budgetedAmountToCapital,
      budgetPeriodsPerYear,
      savingsInterestRate: interestRate,
      inflationRate,
      withdrawalRate
    }
  )
  $: finalYearData = retirementDataSet[retirementDataSet.length - 1]
</script>

<div>
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
  <div class="container">
    {#if finalYearData.capital >= finalYearData.capitalRequired && finalYearData.debtRemaining === 0}
      <div class="toast" >Ready to retire with 0 debt.</div>
    {:else if finalYearData.capital >= finalYearData.capitalRequired}
      <div class="toast" >Passive income outweighs budget, but still in debt.</div>
    {:else}
      <div class="toast quiet">Not ready to Retire</div>
    {/if}
  </div>
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
  }
  .toast {
    width: fit-content;
    background-color: var(--theme-alert);
    margin: 3px;
    padding: 3px;
    border-radius: 2px;
  }
  .toast.quiet {
    background-color: var(--theme-primary);
  }
</style>