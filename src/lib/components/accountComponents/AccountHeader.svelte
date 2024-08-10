<script lang="ts">
  import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';
  import MaterialSymbolsCheck from '~icons/material-symbols/check';
  import { openPopup, selectedTransactionAccount, selectedTransactionType } from '$lib/store.ts'
  import { currencyToString, getHighlightColour } from '$lib/utils'
  import { TransactionType } from '$lib/types/transactionTypes'
  import { AccountType, accountTypeIcons } from '$lib/types/accountTypes'
  import type { AccountTypeBudget, AccountTypeSaving } from '$lib/types/accountTypes'
  import SavingsProgress from '$lib/components/accountComponents/SavingsProgress.svelte'
  import Button from '$lib/components/sharedComponents/Button.svelte'

  export let id
  export let name
  export let value: number = 0
  export let type
  export let additionalAccountData: AccountTypeSaving | AccountTypeBudget

  function getValueString (value) {
    let valueString = currencyToString(value ?? 0)
    if (type === AccountType.SAVING) {
      valueString += ` / ${(additionalAccountData as AccountTypeSaving).target / 100}`
    }
    return valueString
  }

  $: valueString = getValueString(value)
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

<div class="close-flex">
  <div style="flex-grow: 1">
    <div class="header" style="--multiplier-highlight:{highlightColour}">
      <div class="icon">
        {#if type===AccountType.SAVING}
          <p class="multiplier">{additionalAccountData.multiplier/100}X</p>
        {:else}
          <svelte:component this={Icon}/>
        {/if}
      </div>
      <div class="text-box">
        <p>{name}</p>
        <div class="separator" ></div>
        <p>{valueString}</p>
      </div>

    </div>
    {#if type===AccountType.SAVING}
      <SavingsProgress backgroundColor="#4a4de7" multiplier={additionalAccountData.multiplier} savingsGoal={additionalAccountData.target} currentValue={value} />
    {/if}
  </div>
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

<style>
  p {
    margin: 5px;
    align-self: center;
  }
  .text-box {
    display: flex;
    gap: 5px;
    justify-content: end;
    flex-wrap: wrap;
    flex-grow: 1;
  }
  .icon {
      padding: 10px 10px;
      display: flex;
      align-items: center;
  }
  .close-flex {
    display: flex;
    margin: 0;
    justify-content: space-between;
    gap: 0;
    flex-grow: 1;
  }
  .header {
    display: flex;
    justify-content: space-between;
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