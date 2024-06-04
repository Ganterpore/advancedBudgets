<script lang="ts">
  import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';
  import MaterialSymbolsCheck from '~icons/material-symbols/check';
  import { openPopup, selectedTransactionAccount, selectedTransactionType } from '$lib/store.ts'
  import { AccountType, accountTypeIcons } from './types'
  import Button from '$lib/components/Button.svelte'
  import { currencyToString } from '$lib/utils'
  import SavingsProgress from "./savings/SavingsProgress.svelte";
  import type { AccountTypeBudget } from "./budget/types";
  import type { AccountTypeSaving } from "./savings/types";
  import { TransactionType } from "../transactions/types";
  import { getHighlightColour } from "./savings/utils";

  export let id
  export let name
  export let value: number = 0
  export let type
  export let additionalAccountData: AccountTypeSaving | AccountTypeBudget

  $: valueString = currencyToString(value ?? 0)
  $: Icon = type ? accountTypeIcons[type] : undefined
  $: isCompletable = value && value === (additionalAccountData as AccountTypeSaving)?.target
  $: highlightColour = getHighlightColour(false, (additionalAccountData as AccountTypeSaving)?.multiplier)

  async function addTransaction (e, isCompletion) {
    e.stopPropagation()
    $openPopup = 'transaction'
    $selectedTransactionType = isCompletion ? TransactionType.COMPLETION : TransactionType.INDIVIDUAL
    $selectedTransactionAccount = id
  }
</script>

<div class="header" style="--multiplier-highlight:{highlightColour}">
  <div class="icon">
    <svelte:component this={Icon}/>
  </div>
  <p>{name}</p>
  {#if type===AccountType.SAVING}
    <p class="multiplier">{additionalAccountData.multiplier/100}X</p>
  {/if}
  <div class="separator" ></div>
  <p>{valueString}</p>
  {#if type===AccountType.SAVING}
    <p>{` / ${additionalAccountData.target / 100}`}</p>
  {/if}

  {#if isCompletable}
    <Button on:click={(e) => addTransaction(e, true)}>
      <MaterialSymbolsCheck/>
    </Button>
  {:else}
    <Button on:click={addTransaction}>
      <MaterialSymbolsAddRounded/>
    </Button>
  {/if}
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
    .multiplier {
        font-weight: bold;
        color: var(--theme-secondary-text);
        text-shadow: -1px -1px 5px var(--multiplier-highlight), 1px -1px 5px var(--multiplier-highlight), -1px 1px 5px var(--multiplier-highlight), 1px 1px 5px var(--multiplier-highlight);
    }
</style>