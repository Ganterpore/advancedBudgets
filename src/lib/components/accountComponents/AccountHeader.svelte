<script lang="ts">
  import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';
  import MaterialSymbolsCheck from '~icons/material-symbols/check';
  import { currencyToString, getHighlightColour } from '$lib/utils'
  import { TransactionType } from '$lib/types/transactionTypes'
  import { AccountType, accountTypeIcons } from '$lib/types/accountTypes'
  import type { AccountTypeBudget, AccountTypeSaving } from '$lib/types/accountTypes'
  import SavingsProgress from '$lib/components/accountComponents/SavingsProgress.svelte'
  import Button from '$lib/components/sharedComponents/Button.svelte'
  import { getNextOccurrence, numberOfOccurrencesBetween } from '$lib/dayOfWeekFunctons'
  import TransactionPopup from '$lib/components/transactionComponents/TransactionPopup.svelte'
  import type { Budget } from '$lib/types/budgetTypes'
  import { savingsAccountMultiplierToString } from '$lib/helpers/accountHelpers'

  export let accounts
  export let account
  export let value: number = 0
  export let additionalAccountData: AccountTypeSaving | AccountTypeBudget
  export let budgetDetails: Budget

  let isTransactionPopupOpen = false

  function getValueString (value) {
    let subValueString = ''
    if (account.type === AccountType.BUDGET) {
      const today = new Date()
      const budgetAccountDetails = additionalAccountData as AccountTypeBudget
      const nextBudgetRelease = getNextOccurrence(budgetDetails, today)
      const periodsUntilNextBudget = numberOfOccurrencesBetween(budgetAccountDetails, today, nextBudgetRelease)
      const amountStillToBeReleased = budgetAccountDetails.regularBudget * periodsUntilNextBudget
      subValueString = currencyToString(value ?? 0)
      value = value - amountStillToBeReleased
    }
    let valueString = currencyToString(value ?? 0)
    if (account.type === AccountType.SAVING) {
      const target = (additionalAccountData as AccountTypeSaving).target
      if (value !== target) {
        subValueString = currencyToString(target)
      }
    }
    return [valueString, subValueString]
  }
  const getSavingsTransactionsLeft = (savingsDetails: AccountTypeSaving) => {
    if (account.type !== AccountType.SAVING) return 0
    const amountLeft = savingsDetails.target - value
    const weightedAmountLeft = amountLeft / savingsDetails.multiplier
    return Math.ceil(weightedAmountLeft)
  }

  $: [valueString, subValueString] = getValueString(value)
  $: Icon = account.type ? accountTypeIcons[account.type] : undefined
  $: isCompletable = value && value === (additionalAccountData as AccountTypeSaving)?.target
  $: highlightColour = getHighlightColour(isCompletable, (additionalAccountData as AccountTypeSaving)?.multiplier)
  $: savingsTransactionsLeft = getSavingsTransactionsLeft(additionalAccountData as AccountTypeSaving)

  async function addTransaction (e) {
    e.stopPropagation()
    isTransactionPopupOpen = true
  }
</script>

<TransactionPopup
  accounts={accounts}
  account={account}
  selectedTransactionType={isCompletable ? TransactionType.COMPLETION : TransactionType.INDIVIDUAL}
  isOpen={isTransactionPopupOpen}
  onClose={() => isTransactionPopupOpen = false}/>

<div class="close-flex">
  <div style="flex-grow: 1">
    <div class="header" style="--multiplier-highlight:{highlightColour}">
      <div class="icon">
        {#if account.type===AccountType.SAVING}
          {#if additionalAccountData.target <= value}
            <p class="multiplier">✓</p>
          {:else}
            <p class="multiplier">{savingsAccountMultiplierToString(additionalAccountData.multiplier)}</p>
          {/if}
        {:else}
          <svelte:component this={Icon}/>
        {/if}
      </div>
      <div class="text-box">
        <div>
          <p>{account.name}</p>
          {#if account.type===AccountType.SAVING && savingsTransactionsLeft > 0}
            <p class="subValue">{savingsTransactionsLeft} to go</p>
          {/if}
        </div>
        <div class="separator" ></div>
        <div>
          <p>{valueString}</p>
          {#if subValueString !== ''}
            <p class="subValue" style="text-align: right">{subValueString}</p>
          {/if}
        </div>
      </div>

    </div>
    {#if account.type===AccountType.SAVING}
      <SavingsProgress backgroundColor="--theme-primary" multiplier={additionalAccountData.multiplier} savingsGoal={additionalAccountData.target} currentValue={value} />
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
    font-size: medium;
    color: var(--theme-text);
    font-weight: bold;
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
  .subValue {
    font-weight: lighter;
    font-style: italic;
    font-size: smaller;
    color: var(--theme-text-light);
  }
</style>