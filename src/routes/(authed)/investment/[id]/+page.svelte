<script lang="ts">
  import AppBar from '$lib/components/sharedComponents/AppBar.svelte'
  import ListItem from '$lib/components/sharedComponents/ListItem.svelte'
  import MetricsGrid from '$lib/components/sharedComponents/MetricsGrid.svelte'
  import ParentAccountPopup from '$lib/components/accountComponents/ParentAccountPopup.svelte'
  import InvestmentValueChart from '$lib/components/accountComponents/InvestmentValueChart.svelte'
  import { goto } from '$app/navigation'
  import { currencyToString } from '$lib/utils'
  import type { InvestmentValue } from '$lib/types/accountTypes'

  export let data

  let isEditOpen = false

  // Values come newest first
  $: values = data.values as InvestmentValue[]
  $: currentValue = values[0]?.amount ?? 0
  $: firstValue = values[values.length - 1]?.amount ?? 0
  $: totalChange = currentValue - firstValue
  $: totalChangePercent = firstValue ? (totalChange / firstValue) * 100 : 0
  $: history = values.map((v, i) => ({
    ...v,
    change: i < values.length - 1 ? v.amount - values[i + 1].amount : undefined
  }))

  const formatDate = (date: Date) => new Date(date).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
  const formatChange = (change: number) => `${change >= 0 ? '+' : '-'} ${currencyToString(Math.abs(change))}`
</script>

<AppBar title={data.investment.name}
        leftButton={{ name: 'Back', action: () => goto('/') }}
        rightButtons={[{ name: 'Edit', action: () => isEditOpen = true }]}/>

<div class="container">
  <div class="overview">
    <div class="overview-header">
      <h2>Investment Overview</h2>
      <div class="current">
        <span class="label">Current Value</span>
        <span class="amount">{currencyToString(currentValue)}</span>
      </div>
    </div>
    <MetricsGrid metrics={[
      { label: 'Change Since First Value', value: formatChange(totalChange), subValue: `${totalChangePercent.toFixed(2)}%` },
      { label: 'Estimated ROI', value: `${(data.investment.expectedROI / 100).toFixed(2)}% pa` },
      { label: 'Withdrawal Rate', value: `${(data.investment.withdrawalRate / 100).toFixed(2)}% pa` }
    ]} />
  </div>

  <div class="overview">
    <h2>Value Over Time</h2>
    <InvestmentValueChart values={values} />
  </div>

  <div class="listContainer">
    <ListItem secondary>
      <p class="list-title">Value History</p>
    </ListItem>
    <div class="list">
      {#each history as entry (entry.id)}
        <ListItem secondary>
          <div class="row">
            <div>
              <p class="text">{currencyToString(entry.amount)}</p>
              <p class="sub-text">{formatDate(entry.onDate)}</p>
            </div>
            {#if entry.change !== undefined}
              <p class="change" class:positive={entry.change > 0} class:negative={entry.change < 0}>
                {formatChange(entry.change)}
              </p>
            {:else}
              <p class="sub-text">Initial value</p>
            {/if}
          </div>
        </ListItem>
      {:else}
        <ListItem secondary><p class="sub-text">No values recorded yet</p></ListItem>
      {/each}
    </div>
  </div>
</div>

{#key data.investment}
  <ParentAccountPopup bind:isOpen={isEditOpen} investment={{ ...data.investment }} />
{/key}

<style>
  .container {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .overview {
    margin: 20px;
    padding: 20px;
    background: var(--theme-primary);
    border: 1px solid var(--theme-text);
    border-radius: 12px;
    width: 80%;
  }
  .overview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 17px;
  }
  .overview + .overview {
    margin-top: 0;
  }
  .overview > h2 {
    margin-bottom: 15px;
  }
  h2 {
    margin: 0;
    color: var(--theme-text);
  }
  .current {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .label {
    font-size: small;
    color: var(--theme-secondary-text);
  }
  .amount {
    font-size: xx-large;
    font-weight: bold;
    color: greenyellow;
  }
  .listContainer {
    width: 80%;
    background-color: var(--theme-secondary);
    flex-grow: 1;
  }
  .list {
    margin: 0 5px;
    padding: 10px 0 0 0;
    background-color: var(--theme-tertiary);
  }
  .list-title {
    margin: 10px;
    font-weight: bold;
    color: var(--theme-secondary-text);
  }
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
  }
  .text {
    margin: 0;
    font-weight: bold;
    color: var(--theme-text);
  }
  .sub-text {
    margin: 0;
    font-size: small;
    color: var(--theme-text);
  }
  .change {
    margin: 0;
    font-weight: bold;
    color: var(--theme-text);
  }
  .change.positive {
    color: greenyellow;
  }
  .change.negative {
    color: crimson;
  }
  @media (max-width: 600px) {
    .overview, .listContainer {
      width: calc(100% - 32px);
    }
  }
</style>
