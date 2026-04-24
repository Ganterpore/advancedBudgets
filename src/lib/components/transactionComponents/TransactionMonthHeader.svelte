<script>
  import {currencyToString} from "$lib/utils";
  import MetricsGrid from '$lib/components/sharedComponents/MetricsGrid.svelte'

  export let dateString
  export let transactions
  const { positiveSum, negativeSum, transactionList } = transactions

  const dateStringSplit = dateString.split('_')
  const month = dateStringSplit[1]

  // Additional useful metrics
  $: totalTransactions = transactionList.length

  // Largest transactions
  $: largestIncome = transactionList.reduce((max, t) => t.amount > max ? t.amount : max, 0)
  $: largestExpense = Math.abs(transactionList.reduce((min, t) => t.amount < min ? t.amount : min, 0))

  // Daily average (assuming 30 days in month for simplicity)
  $: dailyAverage = (positiveSum + negativeSum) / 30
</script>

<div class="summary-container">
  <!-- Main summary row -->
  <div class="main-row">
    <p class="month">{month}</p>
    <div style="flex-grow: 1"></div>
    <p class="positive">+ {currencyToString(positiveSum)}</p>
    <p class="negative">- {currencyToString(Math.abs(negativeSum))}</p>
    <p class="sum">= {currencyToString(positiveSum + negativeSum)}</p>
  </div>

  <!-- Detailed insights -->
  <MetricsGrid metrics={[
        { label: 'Total Transactions', value: totalTransactions },
        { label: 'Daily Net', value: currencyToString(dailyAverage) },
        { label: 'Largest Income', value: currencyToString(largestIncome) },
        { label: 'Largest Expense', value: currencyToString(largestExpense) },
    ]} />
</div>

<style>
  .summary-container {
    margin: 10px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .main-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }

  .main-row p {
    font-size: medium;
    align-self: center;
    color: var(--theme-secondary-text);
    font-weight: bold;
    margin: 0;
  }

  .month {
    font-size: large !important;
  }

  .positive {
    color: greenyellow !important;
  }

  .negative {
    color: crimson !important;
  }


  @media (max-width: 600px) {
    .main-row {
      flex-wrap: wrap;
    }
  }
</style>