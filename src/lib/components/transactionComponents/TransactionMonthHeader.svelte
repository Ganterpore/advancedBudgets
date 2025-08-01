<script>
  import {currencyToString} from "$lib/utils";

  export let dateString
  export let transactions
  const { positiveSum, negativeSum, transactionList } = transactions

  const dateStringSplit = dateString.split('_')
  const month = dateStringSplit[1]

  // Additional useful metrics
  $: totalTransactions = transactionList.length
  $: averageTransaction = totalTransactions > 0 ? (positiveSum + negativeSum) / totalTransactions : 0
  $: positiveTransactions = transactionList.filter(t => t.amount > 0).length
  $: negativeTransactions = transactionList.filter(t => t.amount < 0).length

  // Largest transactions
  $: largestIncome = transactionList.reduce((max, t) => t.amount > max ? t.amount : max, 0)
  $: largestExpense = Math.abs(transactionList.reduce((min, t) => t.amount < min ? t.amount : min, 0))

  // Unique descriptions (categories)
  $: uniqueDescriptions = [...new Set(transactionList.map(t => t.description))].length

  // Most frequent transaction description
  $: descriptionFrequency = transactionList.reduce((acc, t) => {
    acc[t.description] = (acc[t.description] || 0) + 1
    return acc
  }, {})
  $: mostFrequentDescription = Object.entries(descriptionFrequency)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'

  // Daily average (assuming 30 days in month for simplicity)
  $: dailyAverage = (positiveSum + negativeSum) / 30

  // Transaction frequency insights
  $: transactionFrequency = totalTransactions / 30 // per day

  // Top categories for this month
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
  <div class="insights-grid">
    <div class="insight-card">
      <span class="metric">{totalTransactions}</span>
      <span class="label">Total Transactions</span>
    </div>

    <div class="insight-card">
      <span class="metric">{positiveTransactions}/{negativeTransactions}</span>
      <span class="label">Income/Expenses</span>
    </div>

    <div class="insight-card">
      <span class="metric">{currencyToString(averageTransaction)}</span>
      <span class="label">Avg per Transaction</span>
    </div>

    <div class="insight-card">
      <span class="metric">{currencyToString(dailyAverage)}</span>
      <span class="label">Daily Net</span>
    </div>

    <div class="insight-card">
      <span class="metric">{uniqueDescriptions}</span>
      <span class="label">Categories</span>
    </div>

    <div class="insight-card">
      <span class="metric">{transactionFrequency.toFixed(1)}</span>
      <span class="label">Transactions/Day</span>
    </div>
  </div>

  <!-- Top insights -->
  <div class="top-insights">
    <div class="top-insight">
      <span class="label">Largest Income:</span>
      <span class="value positive">{currencyToString(largestIncome)}</span>
    </div>

    <div class="top-insight">
      <span class="label">Largest Expense:</span>
      <span class="value negative">{currencyToString(largestExpense)}</span>
    </div>

    <div class="top-insight">
      <span class="label">Most Frequent:</span>
      <span class="value">{mostFrequentDescription}</span>
    </div>
  </div>

  <!-- Top categories for this month -->
  {#if topCategories.length > 0}
    <div class="top-categories">
      <h4>Top Categories This Month</h4>
      <div class="categories-list">
        {#each topCategories as [category, stats]}
          <div class="category-item">
            <div class="category-info">
              <span class="category-name">{category}</span>
              <span class="category-count">{stats.count} transactions</span>
            </div>
            <div class="category-amounts">
              {#if stats.income > 0}
                <span class="income">+{currencyToString(stats.income)}</span>
              {/if}
              {#if stats.expenses > 0}
                <span class="expense">-{currencyToString(stats.expenses)}</span>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
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

  .insights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 10px;
  }

  .insight-card {
    background: var(--theme-primary, rgba(255, 255, 255, 0.05));
    border: 1px solid var(--theme-text, rgba(255, 255, 255, 0.1));
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .insight-card .metric {
    font-size: 1.2em;
    font-weight: bold;
    color: var(--theme-text, white);
    margin-bottom: 4px;
  }

  .insight-card .label {
    font-size: 0.8em;
    color: var(--theme-text, rgba(255, 255, 255, 0.7));
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .top-insights {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .top-insight {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: var(--theme-plain, rgba(255, 255, 255, 0.03));
    border-radius: 6px;
  }

  .top-insight .label {
    font-size: 0.9em;
    color: var(--theme-text, rgba(255, 255, 255, 0.7));
  }

  .top-insight .value {
    font-weight: bold;
    color: var(--theme-text, white);
  }

  .top-insight .value.positive {
    color: greenyellow;
  }

  .top-insight .value.negative {
    color: crimson;
  }

  .top-categories {
    margin-top: 15px;
  }

  .top-categories h4 {
    margin: 0 0 12px 0;
    color: var(--theme-text, white);
    font-size: 1.1em;
    font-weight: bold;
  }

  .categories-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .category-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    background: var(--theme-primary, rgba(255, 255, 255, 0.03));
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
    font-size: 0.9em;
  }

  .category-count {
    font-size: 0.75em;
    color: var(--theme-text, rgba(255, 255, 255, 0.7));
  }

  .category-amounts {
    display: flex;
    gap: 8px;
  }

  .income {
    color: greenyellow;
    font-weight: bold;
    font-size: 0.85em;
  }

  .expense {
    color: crimson;
    font-weight: bold;
    font-size: 0.85em;
  }

  @media (max-width: 600px) {
    .insights-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .main-row {
      flex-wrap: wrap;
    }
  }
</style>