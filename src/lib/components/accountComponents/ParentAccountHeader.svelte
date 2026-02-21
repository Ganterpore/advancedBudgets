<script lang="ts">
  import { openPopup, selectedParentAccount } from '$lib/store.ts'
  import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded'
  import { currencyToString } from '$lib/utils'
  import Button from '$lib/components/sharedComponents/Button.svelte'
  import type { AccountNode } from '$lib/types/accountTypes'
  import { calculateN, formatDuration } from '$lib/helpers/financeHelpers'

  export let account: AccountNode
  export let value: number = 0
  $: valueString = currencyToString(value ?? 0)

  async function openChildAccount (id: number, e) {
    e.stopPropagation()
    $openPopup = 'childAccount'
    $selectedParentAccount = id
  }
</script>

<div class="header">
  <div>
    <p>{account.name}</p>
    {#if account.debtInfo}
      <p class="subValue">{formatDuration(calculateN(
        account.debtInfo.principal - value,
        account.debtInfo.percent,
        account.debtInfo.regularRepayment
      ))} left</p>
    {/if}
  </div>
  <div class="separator" ></div>
  <div>
    <p>{valueString}</p>
    {#if account.debtInfo}
      <p class="subValue">{currencyToString(account.debtInfo.principal)}</p>
    {/if}
  </div>
  <Button on:click={(e) => openChildAccount(account.id, e)}>
    <MaterialSymbolsAddRounded/>
  </Button>
</div>

<style>
  p {
    margin: 10px;
    font-size: large;
    color: var(--theme-secondary-text);
    font-weight: bold;
  }
  .subValue {
    font-weight: lighter;
    font-style: italic;
    font-size: smaller;
    color: var(--theme-secondary-text);
  }
  .header {
      display: flex;
      justify-content: space-between;
      padding: 0 0 0 20px;
      gap: 5px;
  }
  .separator {
      flex-grow: 1;
  }
</style>