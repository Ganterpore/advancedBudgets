<script>
  import {currencyToString} from "$lib/utils";
  import { slide } from 'svelte/transition';
  import MetricsGrid from '$lib/components/sharedComponents/MetricsGrid.svelte'

  export let transactionList = []

  let expanded = false

  function toggleExpanded() {
    expanded = !expanded
  }

  // Core account metrics
  $: currentBalance = transactionList.reduce((sum, t) => sum + t.amount, 0)
  $: totalIncome = transactionList.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  $: totalExpenses = Math.abs(transactionList.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))
  $: totalTransactions = transactionList.length

  // Time-based insights
  $: sortedTransactions = [...transactionList].sort((a, b) => new Date(a.transactionTime) - new Date(b.transactionTime))
  $: firstTransaction = sortedTransactions[0]?.transactionTime
  $: lastTransaction = sortedTransactions[sortedTransactions.length - 1]?.transactionTime
  $: accountAge = firstTransaction && lastTransaction ?
    Math.ceil((new Date(lastTransaction) - new Date(firstTransaction)) / (1000 * 60 * 60 * 24)) : 0

  // Advanced metrics
  $: averageTransactionSize = totalTransactions > 0 ? (totalIncome + totalExpenses) / totalTransactions : 0
  $: netFlow = totalIncome - totalExpenses
  $: incomeExpenseRatio = totalExpenses > 0 ? totalIncome / totalExpenses : totalIncome > 0 ? Infinity : 0

  // Transaction frequency
  $: avgTransactionsPerDay = accountAge > 0 ? totalTransactions / accountAge : 0
  $: avgTransactionsPerMonth = avgTransactionsPerDay * 30

  // Largest transactions
  $: largestIncome = transactionList.reduce((max, t) => t.amount > max ? t.amount : max, 0)
  $: largestExpense = Math.abs(transactionList.reduce((min, t) => t.amount < min ? t.amount : min, 0))

  // Category analysis
  $: categoryStats = transactionList.reduce((acc, t) => {
    if (!acc[t.description]) {
      acc[t.description] = { count: 0, total: 0, income: 0, expenses: 0 }
    }
    acc[t.description].count++
    acc[t.description].total += t.amount
    if (t.amount > 0) {
      acc[t.description].income += t.amount
    } else {
      acc[t.description].expenses += Math.abs(t.amount)
    }
    return acc
  }, {})

  $: topCategories = Object.entries(categoryStats)
    .sort(([,a], [,b]) => (b.income + b.expenses) - (a.income + a.expenses))
    .slice(0, 3)

  // Monthly averages
  $: monthsActive = Math.max(1, Math.ceil(accountAge / 30))
  $: avgMonthlyIncome = totalIncome / monthsActive
  $: avgMonthlyExpenses = totalExpenses / monthsActive
  $: avgMonthlyNet = netFlow / monthsActive

  // Format account age
  $: accountAgeText = accountAge > 365 ?
    `${Math.floor(accountAge / 365)} years, ${Math.floor((accountAge % 365) / 30)} months` :
    accountAge > 30 ?
      `${Math.floor(accountAge / 30)} months, ${accountAge % 30} days` :
      `${accountAge} days`
</script>

<div class="account-overview">
  <!-- Header with current balance -->
  <div class="balance-header" on:click={toggleExpanded} on:keydown={(e) => e.key === 'Enter' && toggleExpanded()} tabindex="0" role="button" aria-expanded={expanded}>
    <div class="header-content">
      <h2>Account Overview</h2>
      <div class="expand-indicator" class:expanded>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5.5 7.5L10 12L14.5 7.5" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
      </div>
    </div>
    <div class="current-balance">
      <span class="balance-label">Current Balance</span>
      <span class="balance-amount" class:positive={currentBalance >= 0} class:negative={currentBalance < 0}>
        {currencyToString(currentBalance)}
      </span>
    </div>
  </div>

  <MetricsGrid metrics={[
      { label: 'Total Income', value: currencyToString(totalIncome) },
      { label: 'Total Expenses', value: currencyToString(totalExpenses) },
      { label: 'Total Transactions', value: totalTransactions.toLocaleString() },
  ]} />

  <!-- Monthly averages -->
  {#if expanded}
    <div class="section" transition:slide={{duration: 300}}>
      <h3>Monthly Averages</h3>
      <MetricsGrid metrics={[
        { label: 'Income:', value: currencyToString(avgMonthlyIncome) },
        { label: 'Expenses:', value: currencyToString(avgMonthlyExpenses) },
        { label: 'Net:', value: currencyToString(avgMonthlyNet) },
        { label: 'Transactions:', value: avgTransactionsPerMonth.toFixed(1) },
    ]} />
    </div>
  {/if}
</div>

<style>
  .account-overview {
    margin: 20px;
    padding: 20px;
    background: var(--theme-primary, rgba(255, 255, 255, 0.05));
    border: 1px solid var(--theme-text, rgba(255, 255, 255, 0.1));
    border-radius: 12px;
    width: 80%;
  }

  .balance-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    flex-wrap: wrap;
    gap: 15px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    border-radius: 8px;
    padding: 8px;
    margin: -8px -8px 17px -8px;
  }

  .balance-header:hover {
    background: var(--theme-primary, rgba(255, 255, 255, 0.03));
  }

  .balance-header:focus {
    outline: 2px solid var(--theme-highlight, rgba(255, 255, 255, 0.3));
    outline-offset: 2px;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .balance-header h2 {
    margin: 0;
    color: var(--theme-text, white);
    font-size: 1.8em;
  }

  .expand-indicator {
    transition: transform 0.3s ease;
    color: var(--theme-secondary-text, rgba(255, 255, 255, 0.7));
  }

  .expand-indicator.expanded {
    transform: rotate(180deg);
  }

  .current-balance {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .balance-label {
    font-size: 0.9em;
    color: var(--theme-secondary-text, rgba(255, 255, 255, 0.7));
    margin-bottom: 4px;
  }

  .balance-amount {
    font-size: 2em;
    font-weight: bold;
  }


  .section {
    margin-bottom: 25px;
  }

  .section h3 {
    margin: 0 0 15px 0;
    color: var(--theme-text, white);
    font-size: 1.3em;
  }

  .averages-grid, .insights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
  }

  .average-item, .insight-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: var(--theme-plain, rgba(255, 255, 255, 0.03));
    border-radius: 6px;
  }

  .categories-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .category-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    background: var(--theme-plain, rgba(255, 255, 255, 0.03));
    border-radius: 6px;
  }

  .category-info {
    display: flex;
    flex-direction: column;
  }

  .category-name {
    font-weight: bold;
    color: var(--theme-text, white);
    margin-bottom: 2px;
  }

  .category-count {
    font-size: 0.85em;
    color: var(--theme-text, rgba(255, 255, 255, 0.7));
  }

  .category-amounts {
    display: flex;
    gap: 10px;
  }

  .label {
    font-size: 0.9em;
    color: var(--theme-text, rgba(255, 255, 255, 0.7));
  }

  .value {
    font-weight: bold;
    color: var(--theme-text, white);
  }

  .positive {
    color: greenyellow !important;
  }

  .negative {
    color: crimson !important;
  }

  .income {
    color: greenyellow;
    font-weight: bold;
  }

  .expense {
    color: crimson;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    .account-overview {
      margin: 10px;
      padding: 15px;
    }

    .balance-header {
      flex-direction: column;
      text-align: center;
    }

    .current-balance {
      align-items: center;
    }

    .metrics-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .averages-grid, .insights-grid {
      grid-template-columns: 1fr;
    }

    .category-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .category-amounts {
      align-self: flex-end;
    }
  }
</style>