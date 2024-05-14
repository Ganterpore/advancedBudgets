<script lang="ts">
  import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';
  import { openPopup, selectedTransactionAccount, selectedTransactionType } from '$lib/store.ts'
  import { AccountType, accountTypeIcons } from './types'
  import Button from '$lib/components/Button.svelte'
  import { currencyToString } from '$lib/utils'
  import SavingsProgress from "./savings/SavingsProgress.svelte";
  import type { AccountTypeBudget } from "./budget/types";
  import type { AccountTypeSaving } from "./savings/types";
  import { TransactionType } from "../transactions/types";
  export let id
  export let name
  export let value: number = 0
  export let type
  export let additionalAccountData: AccountTypeSaving | AccountTypeBudget
  $: valueString = currencyToString(value ?? 0)

  $: Icon = type ? accountTypeIcons[type] : undefined
  async function addTransaction (e) {
    e.stopPropagation()
    $openPopup = 'transaction'
    $selectedTransactionType = TransactionType.INDIVIDUAL
    $selectedTransactionAccount = id
  }
</script>

<div class="header">
  <div class="icon">
    <svelte:component this={Icon}/>
  </div>
  <p>{name}</p>
  <div class="separator" ></div>
  <p>{valueString}</p>
  {#if type===AccountType.SAVING}
    <p>{` / ${additionalAccountData.target / 100}`}</p>
  {/if}
  <Button on:click={addTransaction}>
    <MaterialSymbolsAddRounded/>
  </Button>
</div>
{#if type===AccountType.SAVING}
  <SavingsProgress backgroundColor="#4a4de7" multiplier={additionalAccountData.multiplier} savingsGoal={additionalAccountData.target} currentValue={value} />
{/if}

<style>
    .icon {
        padding: 10px 25px;
    }
    .header {
        display: flex;
        justify-content: start;
        gap: 5px;
    }
    .separator {
        flex-grow: 1;
    }
</style>