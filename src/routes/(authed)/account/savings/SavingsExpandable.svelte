<script lang="ts">
  import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';
  import Expandable from "$lib/components/Expandable.svelte";
  import type { Account } from "../types";
  import type { AccountTotals } from "../../transactions/types";
  import type { AccountTypeSaving } from "./types";
  import SavingsProgress from "./SavingsProgress.svelte";
  import Button from "$lib/components/Button.svelte";
  import { openPopup, selectedTransactionAccount, selectedTransactionType } from "$lib/store";
  import { TransactionType } from "../../transactions/types";
  import { currencyToString } from "$lib/utils.js";

  export let parent
  export let accounts: Account[]
  export let totals: AccountTotals

  $: savingsGoal = accounts.reduce(
    (acc: number, s: Account) => acc + (s.additionalAccountData as AccountTypeSaving).target,
    0
  )
  $: currentValue = Object.values(totals).reduce((acc: number, t?: number) => acc + (t ?? 0), 0)

  async function addTransaction (e) {
    e.stopPropagation()
    $openPopup = 'transaction'
    $selectedTransactionType = TransactionType.GROUPED_SAVING
    $selectedTransactionAccount = parent
  }
</script>

<Expandable {...$$restProps}>
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