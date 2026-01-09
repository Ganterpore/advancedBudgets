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

  const getSavingsTransactionsLeft = (savingsDetails: AccountTypeSaving) => {
    if (account.type !== AccountType.SAVING) return 0
    const amountLeft = savingsDetails.target - value
    const weightedAmountLeft = amountLeft / savingsDetails.multiplier
    return Math.ceil(weightedAmountLeft)
  }
  function getValueString (value) {
    let subValueString = ''
    let subheading = ''
    let iconReplacementText = ''
    let progressGoal
    let progressMultiplier
    if (account.type === AccountType.BUDGET) {
      const today = new Date()
      const budgetAccountDetails = additionalAccountData as AccountTypeBudget
      const nextBudgetRelease = getNextOccurrence(budgetDetails, today)
      const periodsUntilNextBudget = numberOfOccurrencesBetween(budgetAccountDetails, today, nextBudgetRelease)
      const amountStillToBeReleased = budgetAccountDetails.regularBudget * periodsUntilNextBudget
      subValueString = currencyToString(value ?? 0)
      value = value - amountStillToBeReleased
    }
    if (account.type === AccountType.PLANNED
      && (additionalAccountData as AccountTypeBudget).startDate <= new Date()
      && (additionalAccountData as AccountTypeBudget).endDate > new Date()
    ) {
      // Presently running planned budget
      const today = new Date()
      const budgetAccountDetails = additionalAccountData as AccountTypeBudget
      const periodsUntilBudgetEnds = numberOfOccurrencesBetween(budgetAccountDetails, today, budgetAccountDetails.endDate!)
      const amountStillToBeReleased = budgetAccountDetails.regularBudget * periodsUntilBudgetEnds
      subValueString = currencyToString(value ?? 0)
      value = value - amountStillToBeReleased
      const daysUntilEnd = Math.round((budgetAccountDetails.endDate!.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      subheading = `${daysUntilEnd} day${daysUntilEnd > 1 ? 's' : ''} left`
    }
    let valueString = currencyToString(value ?? 0)
    if (account.type === AccountType.SAVING) {
      const data = (additionalAccountData as AccountTypeSaving)
      const target = data.target
      if (value !== target) {
        subValueString = currencyToString(target)
        iconReplacementText = savingsAccountMultiplierToString(data.multiplier)
      } else if (value >= target) {
        iconReplacementText = '✓'
      }
      const savingsTransactionsLeft = getSavingsTransactionsLeft(data)
      if (savingsTransactionsLeft > 0) subheading = `${savingsTransactionsLeft} to go`
      progressGoal = data.target
      progressMultiplier = data.multiplier
    }
    if (account.type === AccountType.PLANNED && (additionalAccountData as AccountTypeBudget).startDate > new Date()) {
      // Future planned budget
      const budgetAccountDetails = additionalAccountData as AccountTypeBudget
      const numberOfReleases = numberOfOccurrencesBetween(budgetAccountDetails, budgetAccountDetails.startDate, budgetAccountDetails.endDate!)
      const target = numberOfReleases * budgetAccountDetails.regularBudget
      if (value !== target) {
        subValueString = currencyToString(target)
      } if (value >= target) {
        iconReplacementText = '✓'
      }
      progressGoal = target
      const daysUntil = Math.round((budgetAccountDetails.startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      subheading = `In ${daysUntil} day${daysUntil > 1 ? 's' : ''}`
    }
    if (account.type === AccountType.PLANNED && (additionalAccountData as AccountTypeBudget).endDate <= new Date()) {
      // Past planned budget
      const daysAgo = Math.round(((Date.now() - (additionalAccountData as AccountTypeBudget).endDate!.getTime()) / (1000 * 60 * 60 * 24)))
      subheading = `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`
    }
    return [valueString, subValueString, subheading, iconReplacementText, progressGoal, progressMultiplier]
  }

  $: [valueString, subValueString, subheading, iconReplacementText, progressGoal, progressMultiplier] = getValueString(value)
  $: Icon = account.type ? accountTypeIcons[account.type] : undefined
  $: isCompletable = value && value === (additionalAccountData as AccountTypeSaving)?.target
  $: highlightColour = getHighlightColour(isCompletable, progressMultiplier)

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
        {#if iconReplacementText}
          <p class="multiplier">{iconReplacementText}</p>
        {:else}
          <svelte:component this={Icon}/>
        {/if}
      </div>
      <div class="text-box">
        <div>
          <p>{account.name}</p>
          {#if subheading}
            <p class="subValue">{subheading}</p>
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
    {#if progressGoal !== undefined}
      <SavingsProgress backgroundColor="--theme-primary" multiplier={progressMultiplier} savingsGoal={progressGoal} currentValue={value} />
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