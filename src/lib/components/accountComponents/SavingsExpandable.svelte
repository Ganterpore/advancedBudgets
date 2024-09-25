<script lang="ts">
  import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';
  import SavingsProgress from "./SavingsProgress.svelte";

  import { openPopup, selectedTransactionAccount, selectedTransactionType } from "$lib/store";
  import { currencyToString } from "$lib/utils.js";
  import type { Account, AccountTypeSaving } from '$lib/types/accountTypes'
  import type { AccountTotals } from '$lib/types/transactionTypes'
  import { TransactionType } from '$lib/types/transactionTypes'
  import Expandable from '$lib/components/sharedComponents/Expandable.svelte'
    import Button from '../sharedComponents/Button.svelte';

  export let parent
  export let accounts: Account[]
  export let totals: AccountTotals

  $: savingsGoal = accounts.reduce(
    (acc: number, s: Account) => acc + (s.additionalAccountData as AccountTypeSaving).target,
    0
  )
  $: currentValue = Object.values(totals).reduce((acc: number, t?: number) => acc + (t ?? 0), 0)
  $: totalMultiplier = accounts.reduce((total, acc) => {
    const amountSaved = totals[acc.id]
    const savingsData = acc.additionalAccountData as AccountTypeSaving
    const goal = savingsData.target
    if (amountSaved >= goal) return total
    return total + savingsData.multiplier
  }, 0)

  async function addTransaction (e) {
    e.stopPropagation()
    $openPopup = 'transaction'
    $selectedTransactionType = TransactionType.GROUPED_SAVING
    $selectedTransactionAccount = parent
  }
</script>

<Expandable {...$$restProps}>
  <div slot="subtext">
    <p style="align-self: center; margin: 0; padding: 0; font-style: italic">{totalMultiplier / 100}X</p>
  </div>
  <div slot="header" class="header">
    <div class="progress">
      <p>{`${currencyToString(currentValue)} of ${currencyToString(savingsGoal)}`}</p>
      <SavingsProgress savingsGoal={savingsGoal} currentValue={currentValue} />
    </div>
    <Button on:click={addTransaction}>
      <MaterialSymbolsAddRounded/>
    </Button>
  </div>
  <slot/>
</Expandable>

<style>
  .header {
      flex-grow: 1;
      display: flex;
  }
  .progress {
      flex-grow: 1;
  }
  p {
      text-align: center;
  }
</style>